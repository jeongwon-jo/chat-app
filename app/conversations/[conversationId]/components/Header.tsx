"use client"

import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import useActiveList from '@/hooks/useActiveList';
import useOtherUser from '@/hooks/useOtheruser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HiChevronLeft, HiEllipsisHorizontal, HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
  onSearchChange?: (q: string) => void;
  searchQuery?: string;
}

const Header = ({ conversation, onSearchChange, searchQuery = '' }: HeaderProps) => {
  const otherUser = useOtherUser(conversation)
  const { members } = useActiveList()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = members.indexOf(otherUser?.email || "") !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) return `${conversation.users.length} members`
    return isActive ? "Active" : "Offline"
  }, [conversation, isActive])

  const handleSearchToggle = () => {
    if (searchOpen) {
      onSearchChange?.('')
    }
    setSearchOpen((v) => !v)
  }

  return (
    <>
      <ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="bg-gray-100 w-full border-b border-b-gray-300">
        <div className="flex justify-between items-center sm:px-4 py-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/conversations"
              className="block text-gray-600 transition cursor-pointer lg:hidden hover:text-gray-100"
            >
              <HiChevronLeft size={32} />
            </Link>
            {conversation.isGroup ? (
              <AvatarGroup users={conversation.users} />
            ) : (
              <Avatar user={otherUser} />
            )}
            <div className="flex flex-col">
              <div className="text-gray-900">{conversation.name || otherUser.name}</div>
              <div className="text-sm font-light text-gray-500">
                {statusText}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSearchToggle}
              className="text-gray-500 transition cursor-pointer hover:text-gray-200"
              title="메시지 검색"
            >
              {searchOpen ? <HiXMark size={26} /> : <HiMagnifyingGlass size={24} />}
            </button>
            <HiEllipsisHorizontal
              size={32}
              onClick={() => setDrawerOpen(true)}
              className="text-gray-500 transition cursor-pointer hover:text-gray-200"
            />
          </div>
        </div>
        {searchOpen && (
          <div className="px-4 pb-3">
            <input
              autoFocus
              type="text"
              placeholder="메시지 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-3 py-3 text-sm bg-[#f0f0f0] border border-[#b3b3b3] text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Header
