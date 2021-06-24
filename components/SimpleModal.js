import { Transition } from "@headlessui/react";
import Reveal from "react-awesome-reveal";
import { fadeIn, fadeSlideUp } from "utils/cssAnimation";

export default function SimpleModal({ show, onClose = () => {}, listOfModalSettersToClose = [], children }) {
  if (show) {
    listOfModalSettersToClose.forEach((fn) => fn(false));
  }

  if (!show) return <></>;

  return (
    <div className="fixed z-30 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* BG */}

        <div onClick={() => onClose()} className="fixed inset-0 transition-opacity" aria-hidden="true">
          <Reveal keyframes={fadeIn} duration={200} delay={0}>
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </Reveal>
        </div>

        <div className="flex items-center justify-center w-full h-full -mt-12">
          <Reveal keyframes={fadeSlideUp} duration={300} delay={100}>
            <div
              className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {children}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
