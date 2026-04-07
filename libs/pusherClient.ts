import PusherClient from "pusher-js";

let client: PusherClient;

export const getPusherClient = (): PusherClient => {
  if (!client) {
    client = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
      },
      cluster: "ap3"
    });
  }
  return client;
};
