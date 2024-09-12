// pages/api/read.ts
import pool from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const result = await pool.query('SELECT o.id, o.table_num, o.price, o.created_at, COUNT(*) as count_items FROM orders as o INNER JOIN order_items as oi ON o.id = oi.order_id GROUP BY o.id, o.table_num');
        res.status(200).json(result.rows);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
