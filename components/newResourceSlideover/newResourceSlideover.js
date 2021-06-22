import { h1, h3, h4, p1, p2 } from 'constants/styles'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ArrowLeftIcon, LinkIcon, PhotographIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { useForm } from 'react-hook-form';
import NewWebsiteDetailsPage from './newWebsite';

export default function NewResourceSlideover() {

  const router = useRouter()

  const [newResourceType, setNewResourceType] = useState(null);

  const newSlideoverOpen = router.query.new !== undefined

  const closeSlideOver = () => {
    setNewResourceType(null)
    router.replace("/", undefined, { shallow: true })
  };

  return (
    <Transition.Root show={newSlideoverOpen} as={Fragment}>
      <Dialog as="div" static className="z-20 fixed inset-0 overflow-hidden" open={newSlideoverOpen} onClose={closeSlideOver}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">

                    {!newResourceType && (
                      <div className="flex-1 h-0 overflow-y-auto">
                        <div className={`h-32 transition-all flex flex-col justify-center px-4 bg-green-500 sm:px-6`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Dialog.Title className="text-lg font-medium text-white">
                                Add a Resource
                              </Dialog.Title>
                            </div>
                            <div className="ml-3 h-7 flex items-center">
                              <button
                                type="button"
                                className="bg-green-700 rounded text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => closeSlideOver()}
                              >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-green-200">
                              Build your own investment research library and help others become better investors.
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="pt-4 px-4">
                            <div className="grid grid-cols-2 gap-1">
                              <button type="button" onClick={() => setNewResourceType("website")} className="h-32 flex items-end p-4 shadow border border-gray-100">
                                <p className={`${p2({isDisplay: true})} text-gray-500`}>Website</p>
                              </button>
                              <div className="h-32 flex items-end p-4 shadow border border-gray-100">
                                <p className={`${p2({isDisplay: true})} text-gray-500`}>App</p>
                              </div>
                              <div className="h-32 flex items-end p-4 shadow border border-gray-100">
                                <p className={`${p2({isDisplay: true})} text-gray-500`}>Book</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {newResourceType === "website" && (
                      <NewWebsiteDetailsPage setNewResourceType={setNewResourceType} />
                    )}

                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}