"use client"
import { User } from '@/app/generated/prisma/client';
import useConverSation from '@/hooks/useConversation';
import { FullConversationType } from '@/types'
import React, { useEffect, useMemo, useState } from 'react'
import { MdOutlineGroupAdd } from "react-icons/md"
import { HiMagnifyingGlass } from "react-icons/hi2"
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

const ConversationList = ({ initialItems, users, title }: ConversationListProps) => {
  const [items, setItems] = useState(initialItems);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const session = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const pusherKey = session.data?.user?.email

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const stored = localStorage.getItem('pinnedConversations')
    if (stored) setPinnedIds(JSON.parse(stored))
  }, [])

  const { conversationId, isOpen } = useConverSation()

  useEffect(() => {
    if (!pusherKey) return

    const client = getPusherClient();
    client.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return { ...currentConversation, messages: conversation.messages }
          }
          return currentConversation
        })
      )
    }

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversationId })) return current
        return [conversation, ...current]
      })
    }

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => [...current.filter((item) => item.id !== conversation.id)])
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

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      localStorage.setItem('pinnedConversations', JSON.stringify(next))
      return next
    })
  }

  const filteredItems = useMemo(() => {
    const filtered = searchQuery
      ? items.filter((item) => {
          const name = item.name || item.users.map((u) => u.name).join(' ')
          return name.toLowerCase().includes(searchQuery.toLowerCase())
        })
      : items

    return [...filtered].sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id)
      const bPinned = pinnedIds.includes(b.id)
      if (aPinned && !bPinned) return -1
      if (!aPinned && bPinned) return 1
      return 0
    })
  }, [items, pinnedIds, searchQuery])

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} />
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900`,
          isOpen ? "hidden" : "block w-full left-0",
        )}
      >
        <div className="px-5">
          <div className="flex justify-between pt-4 mb-4">
            <div className="text-2xl font-bold text-neutral-800 dark:text-gray-100">채팅 앱</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-2 text-gray-600 dark:text-gray-300 transition bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer hover:opacity-75"
                title="대화 검색"
              >
                <HiMagnifyingGlass size={18} />
              </button>
              <div
                onClick={() => { setIsModalOpen(true); }}
                className="p-2 text-gray-600 dark:text-gray-300 transition bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer hover:opacity-75"
              >
                <MdOutlineGroupAdd size={20} />
              </div>
            </div>
          </div>
          {isSearchOpen && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="대화 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
        <div className="px-3">
          {filteredItems.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
              pinned={pinnedIds.includes(item.id)}
              onPin={togglePin}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default ConversationList
