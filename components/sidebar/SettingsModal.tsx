import { User } from '@/app/generated/prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {
	CldUploadButton,
	CloudinaryUploadWidgetResults,
	CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../modals/Modal';
import Input from '../inputs/Input';
import Image from "next/image"
import Button from '../Button';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User
}
const SettingsModal = ({
	isOpen,
	onClose,
	currentUser,
}: SettingsModalProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser.name,
      image: currentUser.image,
    }
  })

  const image = watch("image")

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as CloudinaryUploadWidgetInfo;

    setValue("image", info.secure_url, {
      shouldValidate: true
    })
  };

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    axios.post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Error"))
      .finally(() => setIsLoading(false))
  }

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form action="" onSubmit={handleSubmit(onSubmit)}>
				<div className='space-y-12'>
					<div className='pb-12 border-b border-gray-900/10'>
						<h2 className='text-base font-semibold leading-7 text-gray-900 dark:text-gray-100'>프로필</h2>
						<p className='mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400'>프로필을 수정하세요.</p>
						<div className='flex flex-col mt-10 gap-y-8'>
							<Input
								disabled={isLoading}
								label="Name"
								id="name"
								errors={errors}
								required
								register={register}
							/>
							<div>
								<label htmlFor="" className='block text-sm font-medium leading-6 text-gray-900'>Photo</label>
								<div className='flex items-center mt-2 gap-x-3'>
									<Image
										width={48}
										height={48}
										alt="Avatar"
										className="rounded-full max-h-12 shrink-0 object-cover"
										src={
											image || currentUser?.image || "/images/placeholder.png"
										}
									/>
									<CldUploadButton
										options={{ maxFiles: 1 }}
										onSuccess={handleUpload}
										uploadPreset={
											process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET
										}
									>
										<Button disabled={isLoading} secondary type="button">
											Change
										</Button>
									</CldUploadButton>
								</div>
							</div>
						</div>
          </div>
          <div className='flex items-center justify-end gap-x-6 mt-5 '>
            <Button disabled={isLoading} secondary onClick={onClose}>Cancel</Button>
            <Button disabled={isLoading} type='submit'>Save</Button>
          </div>
				</div>
			</form>
		</Modal>
	);
};

export default SettingsModal