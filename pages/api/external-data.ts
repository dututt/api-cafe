// pages/api/external-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    data: any;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();

    res.status(200).json({ data });
}
