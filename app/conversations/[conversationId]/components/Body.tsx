"use client"
import useConverSation from '@/hooks/useConversation';
import { getPusherClient } from '@/libs/pusherClient';
import { FullMessageType } from '@/types';
import axios from 'axios';
import { find } from "lodash";
import { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';

interface BodyProps {
  initialMessages: FullMessageType[]
}
const Body = ({ initialMessages }: BodyProps) => {
	const { conversationId } = useConverSation();
	const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const client = getPusherClient();
		client.subscribe(conversationId);
		bottomRef?.current?.scrollIntoView();

		const messageHandler = (message: FullMessageType) => {
			// axios.post(`/api/conversations/${conversationId}/seen`)
			setMessages((current) => {
				if (find(current, { id: message.id })) {
					return current;
				}

				return [...current, message];
			});

			bottomRef?.current?.scrollIntoView();
		};

		// message:new 이벤트가 오면 messageHandler 호출
		client.bind("messages:new", messageHandler);

		return () => {
			client.unsubscribe(conversationId);
			client.unbind("messages:new", messageHandler);
		};
	}, [conversationId]);

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, i) => (
				<MessageBox
					key={message.id}
					isLast={i === messages.length - 1}
					data={message}
				/>
			))}
			<div className="pt-24" ref={bottomRef} />
		</div>
	);
};

export default Body