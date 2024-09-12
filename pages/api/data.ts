// pages/api/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    message: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        // Handle GET request
        res.status(200).json({ message: 'This is a GET request' });
    } else if (req.method === 'POST') {
        // Handle POST request
        res.status(200).json({ message: 'This is a POST request' });
    } else {
        // Handle other HTTP methods
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
