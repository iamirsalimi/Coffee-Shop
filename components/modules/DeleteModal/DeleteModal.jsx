import React from 'react'

export default function CancelBookingModal({ showModal, setShowModal, isDeleting, deleteHandler, title }) {
    const hideModal = () => {
        setShowModal(false)
    }

    return (
        <div className={`absolute w-full top-0 left-0 h-full z-50 flex items-center justify-center transition-all ${showModal ? 'visible' : 'invisible'}`}>
            <div className={`fixed w-full top-0 left-0 bg-black/65 backdrop-blur-lg min-h-screen transition-all duration-200 ${showModal ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={hideModal}></div>

            <div className={`w-[90%] sm:w-4/5 lg:w-1/3 fixed my-auto -mt-20 h-fit border border-[#1f1f1f] bg-[#0f0f0f] py-7 px-5 rounded-xl dark:bg-primary flex flex-col items-center gap-5 transition-all duration-200 ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <h2 className="text-light-gray dark:text-white font-bold text-lg lg:text-xl text-center">Are you sure you want to delete product with "{title}" title ?</h2>
                <div className="w-full grid grid-cols-2 gap-2">
                    <button
                        className="w-full py-2 rounded-md cursor-pointer bg-green-500 hover:bg-green-600 transition-all text-white"
                        onClick={e => hideModal()}
                    >No</button>
                    <button
                        className="w-full py-2 rounded-md cursor-pointer bg-red-500 disabled:bg-red-300 hover:bg-red-600 transition-all text-white"
                        onClick={e => deleteHandler()}
                        disabled={isDeleting}
                    >{isDeleting ? 'Delete Product' : 'Yes'}</button>
                </div>
            </div>
        </div>
    )
}
