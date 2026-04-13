"use client"

import useConverSation from '@/hooks/useConversation'
import axios from 'axios'
import { CldUploadButton, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from "next-cloudinary"
import { useCallback, useRef } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { HiPaperAirplane } from 'react-icons/hi'
import { HiPhoto, HiXMark } from 'react-icons/hi2'
import { HiReply } from 'react-icons/hi'
import MessageInput from './MessageInput'
import { ReplyPreview } from '@/types'

interface FormProps {
  replyTo?: ReplyPreview | null;
  onCancelReply?: () => void;
}

const Form = ({ replyTo, onCancelReply }: FormProps) => {
  const { conversationId } = useConverSation()
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: { message: "" }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "")
    if (isTypingRef.current) {
      isTypingRef.current = false
      axios.post("/api/typing", { conversationId, isTyping: false })
    }
    axios.post("/api/messages", {
      ...data,
      conversationId,
      ...(replyTo ? { replyToId: replyTo.id } : {}),
    })
    onCancelReply?.()
  }

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as CloudinaryUploadWidgetInfo;
    axios.post("/api/messages", { image: info.secure_url, conversationId })
  }

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true
      axios.post("/api/typing", { conversationId, isTyping: true })
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
      axios.post("/api/typing", { conversationId, isTyping: false })
    }, 2000)
  }, [conversationId])

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {/* 답장 대상 미리보기 */}
      {replyTo && (
        <div className="flex items-center justify-between px-4 pt-2 pb-1 gap-2 text-sm border-l-2 border-primary-text dark:border-primary bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <HiReply size={14} className="text-primary-text dark:text-primary shrink-0" />
            <span className="font-medium text-primary-text dark:text-primary shrink-0">{replyTo.sender.name}</span>
            <span className="text-gray-500 dark:text-gray-400 truncate">
              {replyTo.image ? '📷 이미지' : replyTo.body}
            </span>
          </div>
          <button onClick={onCancelReply} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
            <HiXMark size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center w-full gap-2 px-4 py-4 lg:gap-4">
        <CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}>
          <HiPhoto size={30} className="text-primary-text dark:text-primary" />
        </CldUploadButton>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center w-full gap-2 lg:gap-4"
        >
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="채팅을 입력해주세요."
            onTyping={handleTyping}
          />
          <button
            type="submit"
            className="p-2 transition rounded-full cursor-pointer bg-primary hover:bg-primary-hover"
          >
            <HiPaperAirplane size={18} className="text-gray-800" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form
