"use client"

import Avatar from '@/components/Avatar';
import { FullMessageType, ReplyPreview } from '@/types'
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal';
import axios from 'axios';
import { HiReply, HiTrash } from 'react-icons/hi';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  highlight?: string;
  onReply?: (msg: ReplyPreview) => void;
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

const MessageBox = ({ data, isLast, highlight = '', onReply }: MessageBoxProps) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const isDeleted = !!data.deletedAt;

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  // 이모지별 카운트 그룹핑
  const reactionGroups = (data.reactions ?? []).reduce<Record<string, { count: number; mine: boolean }>>((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, mine: false };
    acc[r.emoji].count += 1;
    if (r.userName === session.data?.user?.name) {
      acc[r.emoji].mine = true;
    }
    return acc;
  }, {});

  const handleReact = (emoji: string) => {
    setShowEmojiPicker(false);
    axios.post(`/api/messages/${data.id}/react`, { emoji });
  };

  const handleDelete = () => {
    axios.delete(`/api/messages/${data.id}`);
  };

  const handleReply = () => {
    onReply?.({ id: data.id, body: data.body, image: data.image, sender: data.sender });
  };

  return (
    <div className={clsx('flex gap-3 px-4 pt-3 pb-1 group', isOwn && 'justify-end')}>
      {/* 상대방 아바타 */}
      {!isOwn && (
        <div className="shrink-0 self-end mb-5">
          <Avatar user={data.sender} />
        </div>
      )}

      <div className={clsx('flex flex-col gap-1 max-w-[70%]', isOwn && 'items-end')}>
        {/* 발신자 + 시간 */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{data.sender.name}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {format(new Date(data.createdAt), 'p')}
          </span>
        </div>

        {/* 답장 원본 미리보기 */}
        {data.replyTo && !isDeleted && (
          <div className={clsx(
            'text-xs px-3 py-1.5 rounded-lg border-l-2 border-primary-text dark:border-primary bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 max-w-xs truncate',
            isOwn && 'self-end'
          )}>
            <span className="font-medium">{data.replyTo.sender.name}</span>
            <span className="ml-1">{data.replyTo.image ? '📷 이미지' : data.replyTo.body}</span>
          </div>
        )}

        {/* 메시지 버블 + 액션 버튼 */}
        <div className={clsx('flex items-end gap-1.5', isOwn && 'flex-row-reverse')}>
          {/* 액션 버튼 (호버 시 표시) */}
          {!isDeleted && (
            <div className={clsx(
              'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mb-1 shrink-0',
              isOwn ? 'flex-row-reverse' : 'flex-row'
            )}>
              {/* 답장 */}
              <button
                onClick={handleReply}
                className="p-1.5 rounded-full text-gray-400 hover:text-primary-text dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="답장"
              >
                <HiReply size={14} />
              </button>

              {/* 이모지 반응 */}
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-primary-text dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm leading-none"
                  title="반응"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div
                    ref={pickerRef}
                    className={clsx(
                      'absolute bottom-full mb-1 flex gap-1 bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1 border border-gray-100 dark:border-gray-700 z-10',
                      isOwn ? 'right-0' : 'left-0'
                    )}
                  >
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => handleReact(e)}
                        className="text-lg hover:scale-125 transition-transform"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 삭제 (본인 메시지만) */}
              {isOwn && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  title="삭제"
                >
                  <HiTrash size={14} />
                </button>
              )}
            </div>
          )}

          {/* 버블 */}
          <div>
            {isDeleted ? (
              <div className="text-sm text-gray-400 dark:text-gray-500 italic px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-full">
                삭제된 메시지입니다.
              </div>
            ) : (
              <div className={clsx(
                'text-sm w-fit overflow-hidden',
                isOwn ? 'bg-primary text-gray-800' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100',
                data.image ? 'rounded-xl p-0' : 'rounded-2xl py-2 px-3'
              )}>
                <ImageModal src={data.image!} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
                {data.image ? (
                  <Image
                    alt="Image"
                    height={288}
                    width={288}
                    onClick={() => setImageModalOpen(true)}
                    src={data.image}
                    className="object-cover transition cursor-pointer hover:scale-110 rounded-xl"
                  />
                ) : (
                  <div>{data.body ? highlightText(data.body, highlight) : null}</div>
                )}
              </div>
            )}

            {/* seen 표시 */}
            {isLast && isOwn && seenList.length > 0 && (
              <div className="text-xs font-light text-gray-500 text-right mt-0.5">
                Seen by {seenList}
              </div>
            )}
          </div>
        </div>

        {/* 이모지 반응 집계 */}
        {Object.keys(reactionGroups).length > 0 && (
          <div className={clsx('flex flex-wrap gap-1', isOwn && 'justify-end')}>
            {Object.entries(reactionGroups).map(([emoji, { count, mine }]) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className={clsx(
                  'flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full border transition',
                  mine
                    ? 'bg-secondary dark:bg-gray-600 border-primary-text dark:border-primary text-gray-800 dark:text-gray-100'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-text dark:hover:border-primary'
                )}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 본인 아바타 */}
      {isOwn && (
        <div className="shrink-0 self-end mb-5">
          <Avatar user={data.sender} />
        </div>
      )}
    </div>
  );
};

export default MessageBox
