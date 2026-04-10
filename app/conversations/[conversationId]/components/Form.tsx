"use client"

import useConverSation from '@/hooks/useConversation'
import axios from 'axios'
import { CldUploadButton, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from "next-cloudinary"
import { useCallback, useRef } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { HiPaperAirplane } from 'react-icons/hi'
import { HiPhoto } from 'react-icons/hi2'
import MessageInput from './MessageInput'

const Form = () => {
  const { conversationId } = useConverSation()
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: { message: "" }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "")
    // 전송 시 typing 중단
    if (isTypingRef.current) {
      isTypingRef.current = false
      axios.post("/api/typing", { conversationId, isTyping: false })
    }
    axios.post("/api/messages", { ...data, conversationId })
  }

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as CloudinaryUploadWidgetInfo;
    axios.post("/api/messages", {
      image: info.secure_url,
      conversationId,
    })
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
    <div className="flex items-center w-full gap-2 px-4 py-4 bg-white dark:bg-gray-900 border-t border-t-gray-200 dark:border-t-gray-700 lg:gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center w-full gap-2 lg:gap-4"
      >
        <CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}>
          <HiPhoto size={30} className="text-primary-text dark:text-primary" />
        </CldUploadButton>
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
  );
}

export default Form
