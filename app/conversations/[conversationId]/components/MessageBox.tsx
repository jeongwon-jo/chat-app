"use client"

import Avatar from '@/components/Avatar';
import { FullMessageType } from '@/types'
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal';

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  highlight?: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 rounded px-0.5">{part}</mark>
          : part
      )}
    </>
  )
}

const MessageBox = ({ data, isLast, highlight = '' }: MessageBoxProps) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email === data?.sender?.email)
    .map((user) => user.name)
    .join(", ")

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end")
  const avatar = clsx(isOwn && "order-2")
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-primary text-gray-800" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  )

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">{data.sender.name}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image!}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              alt="Image"
              height={288}
              width={288}
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              className="object-cover transition cursor-pointer hover:scale-110 translate"
            />
          ) : (
            <div>{data.body ? highlightText(data.body, highlight) : null}</div>
          )}
          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-600">{`Seen by ${seenList}`}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox
