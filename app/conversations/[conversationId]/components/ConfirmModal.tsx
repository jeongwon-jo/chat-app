"use client"

import Button from '@/components/Button';
import Modal from '@/components/modals/Modal';
import useConverSation from '@/hooks/useConversation';
import { Dialog, DialogTitle } from '@headlessui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {FiAlertTriangle} from "react-icons/fi"

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void
}

const ConfirmModal = ({ isOpen, onClose }: ConfirmModalProps) => {
  const router = useRouter()
  const { conversationId } = useConverSation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = () => {
    setIsLoading(true)

    axios.delete(`/api/conversations/${conversationId}`)
    .then(() => {
      onClose();
      router.push("/conversations");
      router.refresh()
    })
    .catch((error) => toast.error("에러가 발생했습니다."))
    .finally(() => {setIsLoading(false)})
  }
  return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="sm:flex sm:items-start">
				<div className="flex items-center justify-center shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
					<FiAlertTriangle className="w-6 h-6 text-red-600 " />
				</div>
				<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
					<DialogTitle
						as="h3"
						className={"text-base font-semibold leading-6 text-gray-900"}
					>
						대화 삭제
					</DialogTitle>
					<div className="mt-2">
						<p className="text-sm text-gray-500">
							이 대화를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
						</p>
					</div>
				</div>
			</div>
			<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
				<Button disabled={isLoading} danger onClick={onDelete}>
					삭제
				</Button>
				<Button disabled={isLoading} secondary onClick={onClose}>
					취소
				</Button>
			</div>
		</Modal>
	);
}

export default ConfirmModal