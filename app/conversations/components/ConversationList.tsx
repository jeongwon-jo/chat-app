"use client"
import GroupChatModal from '@/components/modals/GroupChatModal';
import useConverSation from '@/hooks/useConversation';
import { getPusherClient } from '@/libs/pusherClient';
import { FullConversationType } from '@/types';
import { User } from '@prisma/client';
import clsx from 'clsx';
import { find } from 'lodash';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { HiMagnifyingGlass } from "react-icons/hi2";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from './ConversationBox';

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
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-[#1e1e1e] bg-[#111111]`,
          isOpen ? "hidden" : "block w-full left-0",
        )}
      >
        <div className="px-4">
          <div className="flex justify-between pt-4 mb-4">
            <Image src={"/images/logo_white.png"} width={90} height={20} alt='Hi Chat Logo' />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-2 text-gray-100 transition bg-[#1e1e1e] cursor-pointer hover:text-gray-200 hover:bg-secondary"
                title="대화 검색"
              >
                <HiMagnifyingGlass size={18} />
              </button>
              <div
                onClick={() => { setIsModalOpen(true); }}
                className="p-2 text-gray-100 transition bg-[#1e1e1e] cursor-pointer hover:text-gray-200 hover:bg-secondary"
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
                className="w-full px-3 py-2 text-sm bg-[#1a1a1a] border border-gray-900 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gray-500"
              />
            </div>
          )}
        </div>
        {filteredItems.map((item) => (
          <ConversationBox
            key={item.id}
            data={item}
            selected={conversationId === item.id}
            pinned={pinnedIds.includes(item.id)}
            onPin={togglePin}
          />
        ))}
      </aside>
    </>
  );
}

export default ConversationList
