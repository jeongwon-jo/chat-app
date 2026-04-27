"use client"
import useConverSation from '@/hooks/useConversation';
import { getPusherClient } from '@/libs/pusherClient';
import { FullMessageType, ReplyPreview } from '@/types';
import axios from 'axios';
import { find } from "lodash";
import { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';

interface BodyProps {
  initialMessages: FullMessageType[];
  searchQuery?: string;
  onReply?: (msg: ReplyPreview) => void;
}

interface TypingUser {
  userName: string;
  isTyping: boolean;
}

const Body = ({ initialMessages, searchQuery = '', onReply }: BodyProps) => {
  const { conversationId } = useConverSation();
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);

  useEffect(() => {
    const client = getPusherClient();
    client.subscribe(conversationId);

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) return current;
        return [...current, message];
      });
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((m) => (m.id === newMessage.id ? newMessage : m)),
      );
    };

    const typingHandler = ({ userName, isTyping }: TypingUser) => {
      setTypingUsers((prev) => {
        if (isTyping) return prev.includes(userName) ? prev : [...prev, userName];
        return prev.filter((u) => u !== userName);
      });
    };

    client.bind("messages:new", messageHandler);
    client.bind("messages:update", updateMessageHandler);
    client.bind("typing", typingHandler);

    return () => {
      client.unsubscribe(conversationId);
      client.unbind("messages:new", messageHandler);
      client.unbind("messages:update", updateMessageHandler);
      client.unbind("typing", typingHandler);
    };
  }, [conversationId]);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
    return () => {};
  }, [conversationId]);

  const filteredMessages = searchQuery
    ? messages.filter((m) => m.body?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {filteredMessages.length === 0 && searchQuery ? (
        <div className="flex items-center justify-center h-full text-gray-600 text-sm">
          &quot;{searchQuery}&quot; 검색 결과가 없습니다.
        </div>
      ) : (
        filteredMessages.map((message, i) => (
          <MessageBox
            key={message.id}
            isLast={i === filteredMessages.length - 1}
            data={message}
            highlight={searchQuery}
            onReply={onReply}
          />
        ))
      )}
      {typingUsers.length > 0 && (
        <div className="px-6 pb-2 text-xs text-gray-600 italic">
          {typingUsers.join(', ')}이(가) 입력 중...
        </div>
      )}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body
