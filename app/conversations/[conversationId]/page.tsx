import React from 'react'
import EmptyState from '@/components/EmptyState'
import getConversationById from '@/app/actions/getConversationById'
import getMessages from '@/app/actions/getMessages'
import ConversationClient from './components/ConversationClient'

interface IParams {
  conversationId: string
}
const ConversationIdPage = async ({ params }: { params: Promise<IParams> }) => {
  const { conversationId } = await params
  const conversation = await getConversationById(conversationId)
  const messages = await getMessages(conversationId)

  if (!conversation) {
    return (
      <div className="h-full lg:pl-80">
        <div className="flex flex-col h-full">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full lg:pl-80">
      <div className="flex flex-col h-full dark:bg-gray-800">
        <ConversationClient conversation={conversation} initialMessages={messages} />
      </div>
    </div>
  )
}

export default ConversationIdPage
