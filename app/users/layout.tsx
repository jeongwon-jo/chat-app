import Sidebar from '@/components/sidebar/Sidebar';
import React from 'react'

const UserLayout = ({children}: {children: React.ReactNode}) => {
  return (
		<Sidebar>
			<div className='h-full'>{children}</div>
		</Sidebar>
	);
}

export default UserLayout