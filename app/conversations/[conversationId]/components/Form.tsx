"use client"

import useConverSation from '@/hooks/useConversation'
import { ReplyPreview } from '@/types'
import axios from 'axios'
import { CldUploadButton, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { useCallback, useRef } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { HiPaperAirplane, HiReply } from 'react-icons/hi'
import { HiPhoto, HiXMark } from 'react-icons/hi2'
import MessageInput from './MessageInput'

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
    <div className="bg-gray-100 border-t border-gray-300">
      {/* 답장 대상 미리보기 */}
      {replyTo && (
        <div className="flex items-center justify-between px-5 pt-2 pb-2 gap-2 text-sm border-l-2 border-gray-800 bg-gray-500">
          <div className="flex items-center gap-3 min-w-0">
            <HiReply size={14} className="text-gray-400 shrink-0" />
            <span className="font-medium text-gray-300 shrink-0">{replyTo.sender.name}</span>
            <span className="text-gray-100 truncate">
              {replyTo.image ? '📷 이미지' : replyTo.body}
            </span>
          </div>
          <button onClick={onCancelReply} className="text-gray-100 shrink-0">
            <HiXMark size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center w-full gap-2 px-4 py-4 lg:gap-4">
        <CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}>
          <HiPhoto size={24} className="text-gray-500 hover:text-gray-300 transition" />
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
            className="p-1.5 transition cursor-pointershrink-0"
          >
            <HiPaperAirplane size={22} className="text-primary-text" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form
