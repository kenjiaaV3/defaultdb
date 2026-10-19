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

// PUT: Update produk
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, price, category_id } = body;

    const connection = await mysql.createConnection(dbConfig);
    const query = 'UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?';
    await connection.execute(query, [name, description || '', price, category_id, id]);
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus produk
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}