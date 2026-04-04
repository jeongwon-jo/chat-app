import Sidebar from '@/components/sidebar/Sidebar';
import React from 'react'
import ConversationList from './components/ConversationList';
import getUsers from '../actions/getUsers';
import getConversations from '../actions/getConversations';

const ConversationLayout = async ({children}: {children: React.ReactNode}) => {
	const conversations = await getConversations()
	const users = await getUsers()
  return (
		<Sidebar>
      <div className='h-full'>
				<ConversationList users={users} title="Messages" initialItems={conversations} />
				{children}
			</div>
		</Sidebar>
	);
}

export default ConversationLayout