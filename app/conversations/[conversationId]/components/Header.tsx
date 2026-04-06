"use client"

import { Conversation, User } from '@/app/generated/prisma/client'
import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import useActiveList from '@/hooks/useActiveList';
import useOtherUser from '@/hooks/useOtheruser'
import Link from 'next/link';
import React, { useMemo, useState } from 'react'
import {HiChevronLeft, HiEllipsisHorizontal} from "react-icons/hi2"
import ProfileDrawer from './ProfileDrawer';


interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  }
}
const Header = ({conversation}: HeaderProps) => {
  const otherUser = useOtherUser(conversation)
  const { members } = useActiveList()
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = members.indexOf(otherUser?.email || "") !== -1;
  const statusText = useMemo(() => {
    if(conversation.isGroup) {
      return `${conversation.users.length} members`
    }

    return isActive ? "Active" : "Offline"
  }, [conversation, isActive])

  return (
    <>
      <ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
			<div className="flex justify-between items-center bg-white w-full border-b-[1px] border-b-gray-100 sm:px-4 py-3 px-4 lg:px-6 shadow-sm">
				<div className="flex items-center gap-3">
					<Link
						href={"/conversations"}
						className="block text-orange-500 transition cursor-pointer lg:hidden hover:text-orange-600"
					>
						<HiChevronLeft size={32} />
					</Link>
					{conversation.isGroup ? (
						<AvatarGroup users={conversation.users} />
					) : (
						<Avatar user={otherUser} />
					)}

					<div className="flex flex-col">
						<div>{conversation.name || otherUser.name}</div>
						<div className="text-sm font-light text-neutral-500">
							{statusText}
						</div>
					</div>
				</div>
				<HiEllipsisHorizontal
					size={32}
					onClick={() => {
						setDrawerOpen(true);
					}}
					className="text-orange-500 transition cursor-pointer hover:text-orange-600"
				/>
			</div>
		</>
	);
}

export default Header