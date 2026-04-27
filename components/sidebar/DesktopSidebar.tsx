"use client"

import useRoutes from '@/hooks/useRoutes';
import { User } from '@prisma/client';
import { useState } from 'react';
import Avatar from '../Avatar';
import DesktopItem from './DesktopItem';
import SettingsModal from './SettingsModal';

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar = ({ currentUser }: DesktopSidebarProps) => {
  const routes = useRoutes()
  const [isOpen, setIsOpen] = useState(false);

  return(
    <>
      <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 lg:px-2 xl:px-4 lg:overflow-y-auto lg:bg-[#0d0d0d] lg:pb-4 lg:flex lg:flex-col justify-between border-r border-[#1e1e1e]">
        <nav className="flex flex-col justify-between mt-4">
          <ul className="flex flex-col items-center space-y-2">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="flex flex-col items-center gap-4 mt-4">
          <div
            className="transition cursor-pointer hover:opacity-75"
            onClick={() => setIsOpen(true)}
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar
