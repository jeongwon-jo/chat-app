import { Conversation, User } from '@/app/generated/prisma/client';
import useOtherUser from '@/hooks/useOtheruser';
import React, { useMemo, useState, Fragment } from "react";
import {format} from "date-fns"
import useActiveList from '@/hooks/useActiveList';
import ConfirmModal from './ConfirmModal';
import { IoClose, IoTrash } from "react-icons/io5";
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import AvatarGroup from '@/components/AvatarGroup';
import Avatar from '@/components/Avatar';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[]
  }
}
const ProfileDrawer = ({ isOpen, onClose, data }: ProfileDrawerProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const otherUser = useOtherUser(data);

  const title = data.name || otherUser.name
  const joinedDate = format(new Date(otherUser.createdAt), "PP");

  const { members } = useActiveList()
  const isActive = members.indexOf(otherUser?.email || "") !== -1;
  const statusText = useMemo(() => {
		if (data.isGroup) {
			return `${data.users.length} members`;
		}

		return isActive ? "Active" : "Offline";
	}, [data, isActive]);


  return (
		<>
			<ConfirmModal
				isOpen={confirmOpen}
				onClose={() => setConfirmOpen(false)}
			/>
			<Transition show={isOpen} as={Fragment}>
				<Dialog as="div" className={`relative z-50`} onClose={onClose}>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-500"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-[#00000050]" />
					</TransitionChild>

					<div className="fixed inset-0 overflow-hidden">
						<div className="absolute inset-0 overflow-hidden">
							<div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
								<TransitionChild
									as={Fragment}
									enter="ease-out duration-500 transform transition"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
									leave="ease-out duration-500 transform transiti"
									leaveFrom="translate-x-0"
									leaveTo="translate-x-full"
								>
									<DialogPanel className={"w-screen max-w-md pointer-events-auto"}>
										<div className="flex flex-col py-6 h-full bg-white shadow-xl overflow-y-auto">
											<div className="px-4 sm:px-6">
												<div className="flex items-start justify-end">
													<div className="flex items-center ml-3 h-7">
														<button
															type="button"
															onClick={onClose}
															className={`text-gray-400 bg-white rounded-md hover:text-gray-500 focus:border-2 focus:border-indigo-500 focus:border-offset-2`}
														>
															<span className="sr-only">Close Panel</span>
															<IoClose size={24} />
														</button>
													</div>
												</div>
											</div>
											<div className="relative flex-1 px-4 mt-6 sm:px-6">
												<div className="flex flex-col items-center">
													<div className="mb-2">
														{data.isGroup ? (
															<AvatarGroup users={data.users} />
														) : (
															<Avatar user={otherUser} />
														)}
													</div>
													<div>{title}</div>
													<div className="text-sm text-gray-500">
														{statusText}
													</div>
													<div className="flex gap-10 my-8">
														<div className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-75" onClick={() => {setConfirmOpen(true)}}>
															<div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100">
																<IoTrash />
															</div>
															<div className="text-sm font-light text-neutral-600">
																Delete
															</div>
														</div>
													</div>
												</div>
												<div className="w-full pt-5 pb-5 sm:px-0 sm:pt-0">
													<dl className="px-4 space-y-8 sm:space-y-6 sm:px-6">
														{data.isGroup && (
															<div>
																<dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
																	Emails
																</dt>
																<dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
																	{data.users
																		.map((user) => user.email)
																		.join(", ")}
																</dd>
															</div>
														)}
														{!data.isGroup && (
															<div>
																<dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
																	Emails
																</dt>
																<dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
																	{otherUser.email}
																</dd>
															</div>
														)}
														{!data.isGroup && (
															<>
																<hr />
																<div>
																	<dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
																		Joined
																	</dt>
																	<dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
																		<time dateTime={joinedDate}>
																			{joinedDate}
																		</time>
																	</dd>
																</div>
															</>
														)}
													</dl>
												</div>
											</div>
										</div>
									</DialogPanel>
								</TransitionChild>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default ProfileDrawer