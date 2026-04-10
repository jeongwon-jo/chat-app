"use client"

import { Conversation, Message, User } from '@/app/generated/prisma/client'
import { FullMessageType } from '@/types'
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

  return (
    <>
      <Header
        conversation={conversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Body initialMessages={initialMessages} searchQuery={searchQuery} />
      <Form />
    </>
  )
}

export default ConversationClient
