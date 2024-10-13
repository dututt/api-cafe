// export default async function User({
//   params
// }: {
//   params: { user: string }
// }): Promise<JSX.Element> {
//   const { rows } = await sql`SELECT * from CARTS where user_id=${params.user}`;

//   return (
//     <div>
//       {rows.map((row) => (
//         <div key={row.id}>
//           {row.id} - {row.quantity}
//         </div>
//       ))}
//     </div>
//   );
// }

export default async function User(): Promise<JSX.Element> {
  // const { rows } = await sql`SELECT * FROM users`;

  return (
    <div>
      {/* {rows.map((row) => (
        <div key={row.id}>
          {row.id} - {row.username}
        </div>
      ))} */}
    </div>
  );
}
