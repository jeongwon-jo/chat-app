"use client"

import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from './Modal';
import Input from '../inputs/Input';
import Button from '../Button';
import Select from '../inputs/Select';

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[]
}
const GroupChatModal = ({
	users = [],
	isOpen,
	onClose,
}: GroupChatModalProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: []
    }
  })

  const members = watch("members")

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    axios.post("/api/conversations", { ...data, isGroup: true })
      .then(() => {
        router.refresh()
        onClose();
      })
      .catch(() => toast.error("에러가 났습니다."))
      .finally(() => setIsLoading(false))
  }

  return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='space-y-12'>
					<div className='pb-12 border-b border-[#242424]'>
						<h2 className='text-base font-semibold leading-7 text-gray-100'>그룹 채팅 만들기</h2>
						<p className='mt-1 text-sm leading-6 text-gray-500'>2명 이상의 사람들과 채팅을 만드세요</p>
						<div className='flex flex-col mt-10 gap-y-8'>
							<Input
								disabled={isLoading}
								label="Name"
								id="name"
								errors={errors}
								required
								register={register}
              />
              <Select disabled={isLoading} label="Members" options={users.map((user) => ({ value: user.id, label: user.name }))} onChange={(value) => setValue("members", value, {shouldValidate: true})} value={members} />
						</div>
					</div>
				</div>
				<div className='flex justify-end items-center mt-6 gap-x-6'>
					<Button
						disabled={isLoading}
						onClick={onClose}
						type="button"
						secondary
					>
						취소
					</Button>
					<Button disabled={isLoading} type='submit'>생성</Button>
				</div>
			</form>
		</Modal>
	);
};

export default GroupChatModal