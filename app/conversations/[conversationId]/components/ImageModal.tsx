import Modal from '@/components/modals/Modal';
import React from 'react'
import Image from "next/image";

interface ImageModalProps {
  src?: string;
  isOpen?: boolean;
  onClose: () => void
}
const ImageModal = ({ src, isOpen, onClose }: ImageModalProps) => {
  if (!src) {
    return null
  }

  return <Modal isOpen={isOpen} onClose={onClose}>
    <div className='w-80 h-80'>
      <Image className='object-cover' fill src={src} alt='Image' />
    </div>
  </Modal>;
};

export default ImageModal