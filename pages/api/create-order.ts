import pool from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { numTable, total, selects } = await req.body

        console.log(">>>>>>>>>>>>>>>>>>>>>>{ 3001: 222numTable, total, selects }: ", { numTable, total, selects })

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertOrderText = `INSERT INTO orders(table_num, price) VALUES($1, $2) RETURNING id`;
            const insertOrderValues = [numTable, total];
            const orderResult = await client.query(insertOrderText, insertOrderValues);
            const orderId = orderResult.rows[0].id;

            const insertOrderItemText = `INSERT INTO order_items(order_id, item_id, item_num) VALUES($1, $2, $3)`;
            for (const item of selects) {
                const insertOrderItemValues = [orderId, item.item.id, item.amount];
                await client.query(insertOrderItemText, insertOrderItemValues);
            }
            const result = await client.query('COMMIT');
            console.log(">>>>>>>>>>>>>>>>>>>>>>END:{ 3001: 222numTable, total, selects }: ", { numTable, total, selects })
            res.revalidate("/api/orders")
            return new Response(JSON.stringify(result), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>END ERROR")
            await client.query('ROLLBACK');
            return new Response(`Webhook error: ${error}`, {
                status: 400,
            })
        } finally {
            client.release();
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
