import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: true }
};

// GET: Ambil produk + nama kategori
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT p.*, c.name AS category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id DESC
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah produk baru dengan category_id
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, category_id } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json({ error: 'Nama, harga, dan kategori wajib diisi' }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute(query, [name, description || '', price, category_id]);
    await connection.end();

    return NextResponse.json({ id: result.insertId, name, description, price, category_id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}