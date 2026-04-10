import { pusherServer } from "@/libs/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).end("Unauthorized");
  }

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const data = { user_id: session.user.email };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return res.send(authResponse);
}
