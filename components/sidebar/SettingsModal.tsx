import { User } from '@prisma/client';
import axios from 'axios';
import {
	CldUploadButton,
	CloudinaryUploadWidgetInfo,
	CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../Button';
import Input from '../inputs/Input';
import Modal from '../modals/Modal';

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
					<div>
						<h2 className='text-base font-semibold leading-7 text-gray-100'>프로필</h2>
						<p className='mt-1 text-sm leading-6 text-gray-500'>프로필을 수정하세요.</p>
						<div className='flex flex-col mt-6 gap-y-6'>
							<Input
								disabled={isLoading}
								label="이름"
								id="name"
								errors={errors}
								required
								register={register}
							/>
							<div>
								<label htmlFor="" className='block text-sm font-medium leading-6 text-gray-300'>프로필 이미지</label>
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
										className={`flex justify-center px-3 py-2 text-md font-semibold focus-visible:outline focus-visible:outline-offset-2 transition bg-secondary text-secondary-text hover:bg-secondary-hover${isLoading ? " opacity-50 cursor-default pointer-events-none" : ""}`}
									>
										이미지 변경
									</CldUploadButton>
								</div>
							</div>
						</div>
          </div>
          <div className='flex items-center justify-end gap-x-3 mt-3'>
            <Button disabled={isLoading} secondary onClick={onClose} className="py-2!">취소</Button>
            <Button disabled={isLoading} type='submit' className='py-2!'>저장</Button>
          </div>
				</div>
			</form>
		</Modal>
	);
};

export default SettingsModal