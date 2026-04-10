"use client"

import { Conversation, User } from '@/app/generated/prisma/client'
import { FullMessageType, ReplyPreview } from '@/types'
import { useState } from 'react'
import Header from './Header'
import Body from './Body'
import Form from './Form'

interface ConversationClientProps {
  conversation: Conversation & { users: User[] }
  initialMessages: FullMessageType[]
}

const ConversationClient = ({ conversation, initialMessages }: ConversationClientProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [replyTo, setReplyTo] = useState<ReplyPreview | null>(null)

  return (
    <>
      <Header
        conversation={conversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Body
        initialMessages={initialMessages}
        searchQuery={searchQuery}
        onReply={setReplyTo}
      />
      <Form
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </>
  )
}

export default ConversationClient
