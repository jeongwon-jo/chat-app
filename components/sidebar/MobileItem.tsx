import clsx from 'clsx';
import Link from 'next/link';
import React from 'react'
import { IconType } from 'react-icons';

interface MobileItemProps {
  href: string;
  active?: boolean;
  icon: IconType;
  onClick?: () => void
}
const MobileItem = ({ href, active, icon: Icon, onClick }: MobileItemProps) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        `group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition`,
        active ? "text-primary-text dark:text-primary" : "text-gray-500 dark:text-gray-400"
      )}
    >
      <Icon className="w-6 h-6" />
    </Link>
  )
}

export default MobileItem
