"use client"

import { User } from '@/app/generated/prisma/client'
import useRoutes from '@/hooks/useRoutes';
import React, { useState } from 'react'
import Avatar from '../Avatar';
import DesktopItem from './DesktopItem';

interface DesktopSidebarProps {
	currentUser: User;
}

const DesktopSidebar = ({ currentUser }: DesktopSidebarProps) => {
  const routes = useRoutes()
  const [isOpen, setIsOpen] = useState(false);

  return <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 xl:px-4 lg:overflow-y-auto lg:bg-orange-400 lg:pb-4 lg:flex lg:flex-col justify-between`}>
    <nav className={`flex flex-col justify-between mt-4`}>
      <ul className={`flex flex-col items-center space-y-2`}>
        {routes.map((item) => (
          <DesktopItem key={item.label} href={item.href} label={item.label} icon={item.icon} active={item.active} onClick={item.onClick} />
        ))}
      </ul>
    </nav>
    <nav className={`flex flex-col items-center justify-between mt-4`}>
      <div className={`transition cursor-pointer hover:opacity-75`} onClick={() => setIsOpen(true)}>
        <Avatar user={currentUser} />
      </div>
    </nav>
  </div>;
};

export default DesktopSidebar