"use client"

import { useEffect } from "react";
import { getPusherClient } from "@/libs/pusherClient";
import useActiveList from "./useActiveList";
import { Members } from "pusher-js";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();

  useEffect(() => {
    const pusherClient = getPusherClient();
    const channel = pusherClient.subscribe("presence-messenger");

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: { id: string }) => initialMembers.push(member.id));
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: { id: string }) => {
      add(member.id);
    });

    channel.bind("pusher:member_removed", (member: { id: string }) => {
      remove(member.id);
    });

    return () => {
      pusherClient.unsubscribe("presence-messenger");
    };
  }, [set, add, remove]);
};

export default useActiveChannel;
