import pool from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = await req.body

    const client = await pool.connect();
    if (req.method === 'DELETE') {
        await client.query('BEGIN')

        const updateItemText = `DELETE FROM price USING item WHERE price.item_id=item.id AND item.id =$1 RETURNING *`
        const updateItemValues = [id]
        await client.query(updateItemText, updateItemValues)

        const result = await client.query('COMMIT')
        res.status(200).json({ result })
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
