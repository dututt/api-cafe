// pages/api/external-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    data: string[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const response = await fetch('http://localhost:3001/api/read');
    const data = await response.json();

    res.status(200).json({ data });
}
