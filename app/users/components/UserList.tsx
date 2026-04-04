import { User } from '@/app/generated/prisma/client'
import React from 'react'
import UserBox from './UserBox'

interface UserListProps {
  items : User[]
}
const UserList = ({items}: UserListProps) => {
  return (
    <aside className='fixed inset-y-0 left-0 block w-full pb-20 overflow-y-auto border-r border-gray-200 lg:pb-0 lg:left-20 lg:w-80 lg:block'>
      <div className='px-5'>
        <div className='flex-col'>
          <div className='py-4 text-2xl font-bold text-neutral-800'>사람들</div>
        </div>
      </div>
      {items.map((item) => (
        <UserBox key={item.id} data={item} />
      ))}
    </aside>
  )
}

export default UserList