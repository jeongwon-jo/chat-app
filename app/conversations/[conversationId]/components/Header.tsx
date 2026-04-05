"use client"

import { Conversation, User } from '@/app/generated/prisma/client'
import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import useActiveList from '@/hooks/useActiveList';
import useOtherUser from '@/hooks/useOtheruser'
import Link from 'next/link';
import React, { useMemo } from 'react'

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  }
}
const Header = ({conversation}: HeaderProps) => {
  const otherUser = useOtherUser(conversation)
  const {members} = useActiveList()

  const isActive = members.indexOf(otherUser?.email || "") !== -1;
  const statusText = useMemo(() => {
    if(conversation.isGroup) {
      return `${conversation.users.length} members`
    }

    return isActive ? "Active" : "Offline"
  }, [conversation, isActive])

  return (
    <div>
      <div className='flex items-center gap-3'>
        <Link href={"/conversations"} className='block text-orange-500 transition cursor-pointer lg:hidden hover:text-orange-600'>
          <HiChevronLeft size={32}/>
        </Link>
        {conversation.isGroup ? <AvatarGroup users={conversation.users}/> : <Avatar user={otherUser} />}

        <div className='flex'></div>
      </div>
    </div>
  )
}

export default Header