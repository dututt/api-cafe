import pool from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, title, content, type, image, price } = await req.body

        const client = await pool.connect();
        try {
            await client.query('BEGIN')

            const updateItemText = `UPDATE Item SET title=$1, content=$2, type=$3, image=$4 WHERE id=$5`
            const updateItemValues = [title, content, type, image, id]
            await client.query(updateItemText, updateItemValues)

            const updatePriceText = `UPDATE price SET price=$1 WHERE item_id=$2`
            const updatePriceValues = [price, id]
            await client.query(updatePriceText, updatePriceValues)

            const result = await client.query('COMMIT')
            await res.revalidate('/api/food-beverage')
            res.status(200).json({ result })
        } catch (error) {
            await client.query('ROLLBACK')
            res.status(500).json({ error: 'failed to update order' })
        } finally {
            client.release()
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
