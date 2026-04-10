import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import useOtherUser from '@/hooks/useOtheruser';
import { FullConversationType } from '@/types'
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import { format } from "date-fns"
import { MdOutlinePushPin } from "react-icons/md";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  pinned?: boolean;
  onPin?: (id: string) => void;
}
const ConversationBox = ({ data, selected, pinned, onPin }: ConversationBoxProps) => {
  const otherUser = useOtherUser(data);
  const session = useSession()
  const router = useRouter()

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1]
  }, [data.messages])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an image"
    if (lastMessage?.body) return lastMessage?.body
    return "대화를 시작했습니다."
  }, [lastMessage?.body, lastMessage?.image])

  const userEmail = session.data?.user?.email
  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;
    const seenArray = lastMessage.seen || []
    if (!userEmail) return false
    return seenArray.filter((user) => user.email === userEmail).length !== 0
  }, [lastMessage, userEmail])

  const handleClick = () => {
    router.push(`/conversations/${data.id}`)
  }

  return (
		<div
			onClick={handleClick}
			className={clsx(
				`w-full relative flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition cursor-pointer mb-3 group`,
				selected
					? "bg-neutral-200 dark:bg-gray-700"
					: "bg-white dark:bg-gray-900",
			)}
		>
			{data.isGroup ? (
				<AvatarGroup users={data.users} />
			) : (
				<Avatar user={otherUser} />
			)}
			<div className="flex-1 min-w-0">
				<div className="focus:outline-none">
					<div className="flex items-center justify-between mb-1">
						<div className="flex items-center gap-1">
							<p className="font-medium text-gray-900 dark:text-gray-100 text-md">
								{data.name || otherUser.name}
							</p>
							{pinned && (
								<MdOutlinePushPin
									size={12}
									className="text-primary-text dark:text-primary shrink-0"
								/>
							)}
						</div>
						{lastMessage?.createdAt && (
							<p className="text-xs font-light text-gray-400">
								{format(new Date(lastMessage.createdAt), "p")}
							</p>
						)}
					</div>
					<p
						className={clsx(
							`truncate text-sm`,
							hasSeen
								? "text-gray-500 dark:text-gray-400"
								: "text-black dark:text-gray-200 font-medium",
						)}
					>
						{lastMessageText}
					</p>
				</div>
			</div>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onPin?.(data.id);
				}}
				className={clsx(
					`shrink-0 p-1 rounded-full transition opacity-0 group-hover:opacity-100`,
					pinned
						? "text-primary-text dark:text-primary bg-secondary dark:bg-gray-700"
						: "text-gray-400 dark:text-gray-500 hover:text-primary-text dark:hover:text-primary hover:bg-secondary dark:hover:bg-gray-700",
				)}
				title={pinned ? "고정 해제" : "고정"}
			>
				<MdOutlinePushPin size={14} />
			</button>
		</div>
	);
}

export default ConversationBox
