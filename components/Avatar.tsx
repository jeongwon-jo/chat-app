import { User } from '@prisma/client';
import Image from 'next/image';

interface AvatarProps {
  user: User;
  isActive?: boolean;
}
const Avatar = ({ user, isActive }: AvatarProps) => {
  return (
		<div className="relative">
			<div className="relative inline-block rounded-full h-9 w-9 md:h-11 md:w-11">
				<div className='w-full h-full rounded-full overflow-hidden'>
					<Image
						fill
						src={user?.image || "/images/placeholder.png"}
						alt="Avatar"
						className='rounded-full object-cover'
					/>
				</div>
				{isActive && (
					<span
						className="absolute block rounded-full bg-green-500 border border-white top-0.5 h-2 w-2 md:h-3 md:w-3 right-0"
					/>
				)}
			</div>
		</div>
	);
};

export default Avatar