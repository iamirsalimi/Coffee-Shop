import CommentForm from "@/components/modules/CommentFrom/CommentForm"
import Comment from "@/components/modules/Comment/Comment"

function RatingAndComments() {
    return (
        <div className="w-full h-full bg-black pb-20 pt-10">
            <div className="container mx-auto w-full flex flex-col gap-5">
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="w-full md:w-1/2 flex items-center gap-5">
                        <div className="flex flex-col items-center gap-1">
                            <h3 className="text-5xl md:text-7xl lg:text-9xl text-nowrap">4.5<span className="text-lg text-gray-500">/5</span></h3>
                            <p className="text-gray-500 font-bold text-xs xs:text-sm sm:text-base text-nowrap">(50 Reviews)</p>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex items-center gap-1">
                                <div className="inline-flex items-center justify-center gap-0.5 text-sm">
                                    <div className="text-white text-sm xs:text-base font-semibold">5</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-yellow-500 fill-yellow-500 w-4 h-4 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div className="w-full relative">
                                    <div className="w-full h-2 py-1 rounded-full bg-[#171717]"></div>
                                    <div className="w-[20%] h-2 py-1 absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="inline-flex items-center justify-center gap-0.5 text-sm">
                                    <div className="text-white text-sm xs:text-base font-semibold">4</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-yellow-500 fill-yellow-500 w-4 h-4 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div className="w-full relative">
                                    <div className="w-full h-2 rounded-full bg-[#171717]"></div>
                                    <div className="w-[50%] h-2 absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="inline-flex items-center justify-center gap-0.5 text-sm">
                                    <div className="text-white text-sm xs:text-base font-semibold">3</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-yellow-500 fill-yellow-500 w-4 h-4 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div className="w-full relative">
                                    <div className="w-full h-2 rounded-full bg-[#171717]"></div>
                                    <div className="w-[35%] h-2 absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="inline-flex items-center justify-center gap-0.5 text-sm">
                                    <div className="text-white text-sm xs:text-base font-semibold">2</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-yellow-500 fill-yellow-500 w-4 h-4 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div className="w-full relative">
                                    <div className="w-full h-2 rounded-full bg-[#171717]"></div>
                                    <div className="w-[70%] h-2 absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="inline-flex items-center justify-center gap-0.5 text-sm">
                                    <div className="text-white text-sm xs:text-base font-semibold">1</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-yellow-500 fill-yellow-500 w-4 h-4 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div className="w-full relative">
                                    <div className="w-full h-2 rounded-full bg-[#171717]"></div>
                                    <div className="w-[90%] h-2 absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 p-4 border border-[#1f1f1f] rounded-2xl space-y-4 bg-[#0f0f0f]">
                        <h2 className="text-lg font-semibold text-white">
                            Comment Guidelines
                        </h2>

                        <ul className="flex flex-col gap-2 text-sm text-gray-400 list-disc pl-5">
                            <li>
                                All comments are reviewed before being published. Please avoid offensive or inappropriate language.
                            </li>
                            <li>
                                Share honest feedback based on your real experience with this product or our service.
                            </li>
                            <li>
                                Constructive criticism is always welcome and helps us improve.
                            </li>
                            <li>
                                For detailed issues or direct communication, please use the Contact page.
                            </li>
                        </ul>
                    </div>
                </div>
                {/* comment Form */}
                <CommentForm />

                <div className="flex flex-col items-center md:items-start gap-5 mt-10">
                    <h2 className="w-full text-white text-4xl lg:text-5xl font-bold">Reviews</h2>
                    <div className="w-full flex flex-col gap-2">
                        <Comment />
                        <Comment />
                        <Comment />
                        <Comment />
                        <Comment /> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RatingAndComments
