// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type User = {
    id: number;
    name: string;
};

type Data = {
    user: User;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const user: User = { id: 1, name: 'John Doe' };
    res.status(200).json({ user });
}
