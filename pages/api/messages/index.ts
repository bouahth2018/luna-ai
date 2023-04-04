// import { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/react";

// export default async function handle(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { messages, conversation } = req.body;

//   const session = await getSession({ req });
//   const result = await prisma.message.create({
//     data: {
//       text: messages.content,
//       sender: messages.role,
//       conversation: conversation,
//     },
//   });
//   res.json(result);
// }
