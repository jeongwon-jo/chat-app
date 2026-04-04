import { User } from 'next-auth';
import Image from 'next/image';
import React from 'react'

interface AvatarProps {
  user: User
}
const Avatar = ({ user }: AvatarProps) => {
  return (
		<div className="relative">
			<div className="relative inline-block rounded-full h-9 w-9 md:h-11 md:w-11">
				<Image
					fill
					src={user?.image || "/images/placeholder.png"}
					alt="Avatar"
				/>
				<span
					className={`absolute block rounded-full bg-green-500 ring-2 ring-white top-0 h-2 w-2 md:h-3 md:w-3 right-0`}
				/>
			</div>
		</div>
	);
};

export default Avatar