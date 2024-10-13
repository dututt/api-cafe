import pool from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id, numTable } = await req.body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updateItemText = `UPDATE orders SET table_num=$1 WHERE id=$2 RETURNING *`;
      const updateItemValues = [numTable, id];
      await client.query(updateItemText, updateItemValues);

      const result = await client.query("COMMIT");
      res.status(200).json({ result });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: "failed to update order number table" });
    } finally {
      client.release();
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
