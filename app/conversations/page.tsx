"use client"
import EmptyState from '@/components/EmptyState'
import useConverSation from '@/hooks/useConversation'
import clsx from 'clsx'
import React from 'react'

const ConversationPage = () => {
  const { isOpen } = useConverSation()
  return (
    <div className={clsx(`lg:pl-80 h-full lg:block`, isOpen ? "block" :"hidden")}>
      <EmptyState />
    </div>
  )
}

export default ConversationPage