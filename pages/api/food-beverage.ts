// pages/api/read.ts
import pool from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const result = await pool.query('SELECT i.id,i.title,i.content,i.type,i.image,p.price FROM Item as i INNER JOIN price as p ON i.id=p.item_id');
        res.status(200).json(result.rows);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
