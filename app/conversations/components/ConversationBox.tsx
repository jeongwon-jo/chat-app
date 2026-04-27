import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import useOtherUser from '@/hooks/useOtheruser';
import { FullConversationType } from '@/types';
import clsx from 'clsx';
import { format } from "date-fns";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
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

  const unreadCount = useMemo(() => {
    if (!userEmail || selected) return 0
    return data.messages.filter((m) =>
      m.sender?.email !== userEmail &&
      !m.seen?.some((u) => u.email === userEmail)
    ).length
  }, [data.messages, userEmail, selected])

  const handleClick = () => {
    router.push(`/conversations/${data.id}`)
  }

  return (
		<div
			onClick={handleClick}
			className={clsx(
				`w-full relative flex items-center gap-2.5 p-3 pr-4 hover:bg-[#1a1a1a] transition cursor-pointer mb-1 group`,
				selected
					? "bg-[#1e1e1e]"
					: "bg-transparent",
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
						<div className="flex items-center gap-2">
							<p className="font-medium text-gray-100 text-sm">
								{data.name || otherUser.name}
							</p>
							{unreadCount > 0 && (
								<span className="inline-flex items-center rounded-full justify-center size-4 text-xs font-bold text-gray-900 bg-primary">
									{unreadCount > 99 ? '99+' : unreadCount}
								</span>
							)}
							{pinned && (
								<MdOutlinePushPin
									size={12}
									className="text-gray-100 shrink-0"
								/>
							)}
						</div>
						<div className="flex items-center gap-1.5 shrink-0">
							{lastMessage?.createdAt && (
								<p className="text-xs font-light text-gray-400">
									{format(new Date(lastMessage.createdAt), "p")}
								</p>
							)}
						</div>
					</div>
					<p
						className={clsx(
							`truncate text-sm`,
							hasSeen
								? "text-gray-300"
								: "text-gray-100 font-medium",
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
					`shrink-0 p-1 transition hidden group-hover:block`,
					pinned
						? "text-gray-100 bg-[#2e2e2e]"
						: "text-gray-600 hover:text-gray-200 hover:bg-[#2e2e2e]",
				)}
				title={pinned ? "고정 해제" : "고정"}
			>
				<MdOutlinePushPin size={14} />
			</button>
		</div>
	);
}

export default ConversationBox
