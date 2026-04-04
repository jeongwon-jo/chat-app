"use client"

import React, { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { ClipLoader } from 'react-spinners'
const TESTPAGE = () => {
  return (
    <Transition show={true} as={Fragment}>
      <Dialog as="div" className={`relative z-50`} onClose={() => {}}>
        <TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <div className='fixed inset-0 transition-opacity bg-gray-100 bg-opacity-50'></div>
        </TransitionChild>
        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full p-4 text-center'>
            <TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95' enterTo='opacity-100 translate-y-0 sm:scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 translate-y-0 sm:scale-100' leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
              <DialogPanel>
                <ClipLoader size={40} color='#0284c7'/>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TESTPAGE