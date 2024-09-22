import pool from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = await req.body

    const client = await pool.connect();
    if (req.method === 'DELETE') {
        try {
            await client.query('BEGIN')

            const updateItemText = `DELETE FROM price USING item WHERE price.item_id=item.id AND item.id =$1 RETURNING *`
            const updateItemValues = [id]
            await client.query(updateItemText, updateItemValues)

            const result = await client.query('COMMIT')
            res.status(200).json({ result })
        } catch (error) {
            await client.query('ROLLBACK')
            res.status(500).json({ error: 'failed to delete item food-beverage' })
        } finally {
            client.release()
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
