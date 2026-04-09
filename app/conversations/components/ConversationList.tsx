"use client"
import { User } from '@/app/generated/prisma/client';
import useConverSation from '@/hooks/useConversation';
import { FullConversationType } from '@/types'
import React, { useEffect, useState } from 'react'
import {MdOutlineGroupAdd} from "react-icons/md"
import ConversationBox from './ConversationBox';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { getPusherClient } from '@/libs/pusherClient';
import { find } from 'lodash';
import GroupChatModal from '@/components/modals/GroupChatModal';

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title: string;
}
const ConversationList = ({initialItems, users, title} : ConversationListProps) => {
  const [items, setItems] = useState(initialItems);
  const session = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const pusherKey = session.data?.user?.email  

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  const { conversationId, isOpen } = useConverSation()
  
  useEffect(() => {
    if (!pusherKey) {
      return
    }

    const client = getPusherClient();
    client.subscribe(pusherKey);

    const updateHandler = (conversation:FullConversationType) => {
      setItems((current) => 
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation, 
              messages: conversation.messages
            }
          } 
          return currentConversation
        })
      ) 
    }

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversationId })) {
          return current
        }
        return [conversation, ...current]
      })  
    }

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((item) => item.id !== conversation.id)]
      })
    }
    
    client.bind("conversation:update", updateHandler);
    client.bind("conversation:new", newHandler);
    client.bind("conversation:remove", removeHandler);

    return () => {
      client.unsubscribe(pusherKey);
      client.unbind("conversation:update", updateHandler);
      client.unbind("conversation:new", newHandler);
      client.unbind("conversation:remove", removeHandler);
    }
  }, [pusherKey]);

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} />
			<aside
				className={clsx(
					`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
					isOpen ? "hidden" : "block w-full left-0",
				)}
			>
				<div className="px-5">
					<div className="flex justify-between pt-4 mb-4">
						<div className="text-2xl font-bold text-neutral-800 ">채팅 앱</div>
						<div
							onClick={() => {
								setIsModalOpen(true);
							}}
							className="p-2 text-gray-600 transition bg-gray-200 rounded-full cursor-pointer hover:opacity-75"
						>
							<MdOutlineGroupAdd size={20} />
						</div>
					</div>
				</div>
				<div className="px-3">
					{items.map((item) => (
						<ConversationBox
							key={item.id}
							data={item}
							selected={conversationId === item.id}
						/>
					))}
				</div>
			</aside>
		</>
	);
}

export default ConversationList