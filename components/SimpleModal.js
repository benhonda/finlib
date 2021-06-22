import { Transition } from '@headlessui/react'

export default function SimpleModal({ show, onClose = () => {}, children }) {

  return (
    <Transition
      show={show}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed z-30 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          {/* BG */}
          <div onClick={() => onClose()} className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>
        
          <div className="flex items-center justify-center w-full h-full -mt-12">
            <div className="bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )

}
