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
        `group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 hover:text-gray-100 hover:bg-[#1a1a1a] transition`,
        active ? "text-gray-100 bg-[#1a1a1a]" : "text-gray-500"
      )}
    >
      <Icon className="w-6 h-6" />
    </Link>
  )
}

export default MobileItem
