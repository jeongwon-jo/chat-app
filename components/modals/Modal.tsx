import React, { Fragment } from 'react'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import {IoClose} from "react-icons/io5"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode
}
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
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
				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex items-center justify-center min-h-full p-4 text-center">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
              <DialogPanel className={"relative w-full px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6"}>
                <div className='absolute top-0 right-0 z-10 hidden pt-4 pr-4 sm:block'>
                  <button type="button" onClick={onClose} className='text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:border-2 focus:border-indigo-500'><IoClose className='w-6 h-6' /></button>
                </div>
                {children}
              </DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default Modal