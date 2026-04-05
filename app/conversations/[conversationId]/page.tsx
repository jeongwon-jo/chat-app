import React from 'react'
import EmptyState from '@/components/EmptyState'
import getConversationById from '@/app/actions/getConversationById'
import getMessages from '@/app/actions/getMessages'
import Header from './components/Header'
import Body from './components/Body'
import Form from './components/Form'

interface IParams {
  conversationId: string
}
const ConversationIdPage = async ({params} : {params:Promise<IParams>}) => {
  const { conversationId } = await params
  const conversation = await getConversationById(conversationId)
  const messages = await getMessages(conversationId)

  if(!conversation) {
    return(
      <div className='h-full lg:pl-80'>
        <div className='flex flex-col h-full'>
          <EmptyState />
        </div>
      </div>
    )
  }
  return (
    <div className='h-full lg:pl-80'>
      <div className='flex flex-col h-full'>
        <Header conversation={conversation}/>
        <Body initialMessages={messages}/>
        <Form />
      </div>
    </div>
  )
}

export default ConversationIdPage