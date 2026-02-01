import React from 'react'

function SignupModal({ showModal, setShowModal }) {
    const hideModal = () => {
        setShowModal(false)
    }

    return (
        <div className={`absolute w-full top-0 left-0 h-full z-50 flex items-center justify-center transition-all ${showModal ? 'visible' : 'invisible'}`}>
            <div className={`fixed w-full top-0 left-0 bg-black/65 backdrop-blur-lg min-h-screen transition-all duration-200 ${showModal ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={hideModal}></div>

            <div className={`w-[90%] sm:w-4/5 lg:w-1/3 fixed my-auto -mt-20 h-fit border border-[#1f1f1f] bg-[#0f0f0f] p-2 rounded-2xl dark:bg-primary flex flex-col items-center gap-7 transition-all duration-200 ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <h2 className="text-white text-center mt-5 font-bold text-2xl">Tips and rules you should obey</h2>
                <ul className="flex flex-col gap-2 text-sm p-5 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 list-disc pl-5">
                    <li>
                        all fields are mandatory.
                    </li>
                    <li>
                        username must be between 5 to 18 characters
                    </li>
                    <li>
                        password must at least be 8 characters and contains 1 character (#or@or.) , 1 number  , 1 uppercase letter , and 1 lowercase letter
                    </li>
                </ul>


                <button
                    className="w-full py-2 rounded-xl cursor-pointer bg-amber-500 hover:bg-amber-600 transition-all text-black font-bold"
                    onClick={e => hideModal()}
                >okay</button>
            </div>
        </div>
    )
}

export default SignupModal