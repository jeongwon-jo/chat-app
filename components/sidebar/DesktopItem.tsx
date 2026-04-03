import clsx from 'clsx';
import Link from 'next/link';
import React from 'react'
import { IconType } from 'react-icons';

interface DesktopItemProps {
  href: string;
  label: string;
  icon: IconType;
  onClick?: () => void;
  active?: boolean;
}
const DesktopItem = ({ href, label, icon: Icon, onClick, active }: DesktopItemProps) => {
  const handleClick = () => {
    if (onClick) {
      return onClick()
    }
  }
  return (
		<li onClick={handleClick}>
			<Link
				href={href}
				className={clsx(
					`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold hover:text-black hover:bg-gray-100 bg-white`,
					active ? " text-orange-600" : "text-gray-500",
				)}
			>
				<Icon className="w-6 h-6 shrink-0" />
				<span className="sr-only">{label}</span>
			</Link>
		</li>
	);
};

export default DesktopItem
