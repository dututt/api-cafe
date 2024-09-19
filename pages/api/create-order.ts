import pool from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { numTable, total, selects, status } = await req.body

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertOrderText = `INSERT INTO orders(table_num, price, status) VALUES($1, $2, $3) RETURNING id`;
            const insertOrderValues = [numTable, total, status];
            const orderResult = await client.query(insertOrderText, insertOrderValues);
            const orderId = orderResult.rows[0].id;

            const insertOrderItemText = `INSERT INTO order_items(order_id, item_id, item_num) VALUES($1, $2, $3)`;
            for (const item of selects) {
                const insertOrderItemValues = [orderId, item.item.id, item.amount];
                await client.query(insertOrderItemText, insertOrderItemValues);
            }
            const result = await client.query('COMMIT');
            res.status(200).json({ result })
        } catch (error) {
            await client.query('ROLLBACK');
            res.status(500).json({ error: 'failed to create order' })
        } finally {
            await res.revalidate("/api/orders")
            client.release();
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
