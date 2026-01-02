import Title from "@/components/modules/Title/Title"
import ClientComment from '@/components/modules/ClientComment/ClientComment'
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay, Controller } from 'swiper/modules';

import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { useRef } from "react";

function WhatOurCustomersSay() {
    let swiperRef = useRef(null)

    return (
        <div className="pb-10 w-full min-h-screen bg-black">
            <div className="container mx-auto px-5 py-10 w-full h-full flex flex-col gap-8 items-start justify-start">
                <div className="sm:pr-5 w-full flex items-start justify-between">
                    <div className="flex flex-col items-start gap-8">
                        <Title title="What Our Customers Say" />
                        <p className="text-white text-lg text-center md:text-justify">Real stories from people who enjoy our coffee, atmosphere, and service every day.</p>
                    </div>
                    <div className="w=fit h-fit flex items-center justify-center gap-2">
                        <button
                            onClick={() => swiperRef?.current.swiper.slidePrev()}
                            className="hidden md:block p-2 rounded-full cursor-pointer bg-[#171717]"
                        >
                            <GrFormPrevious className="text-white text-2xl" />
                        </button>
                        <button
                            onClick={() => swiperRef?.current.swiper.slideNext()}
                            className="hidden md:block p-2 rounded-full cursor-pointer bg-[#171717]"
                        >
                            <GrFormNext className="text-white text-2xl" />
                        </button>
                    </div>
                </div>


                <div className="flex items-center justify-center gap-1 w-full h-full">
                    <button
                        onClick={() => swiperRef?.current.swiper.slidePrev()}
                        className="block md:hidden p-2 rounded-full cursor-pointer bg-[#171717]"
                    >
                        <GrFormPrevious className="text-white text-2xl" />
                    </button>
                    <Swiper
                        // slidesPerView={1}
                        ref={swiperRef}
                        spaceBetween={20}
                        freeMode={true}
                        modules={[Autoplay, Controller]}
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        // making it responsive
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper h-full w-full !px-2 !pb-5"
                    >
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ClientComment username="AlexGreen" commentText="the atmosphere and the taste of the coffee was perfect" score={4} />
                        </SwiperSlide>
                    </Swiper>
                    <button
                        onClick={() => swiperRef?.current.swiper.slideNext()}
                        className="block md:hidden p-2 rounded-full cursor-pointer bg-[#171717]"
                    >
                        <GrFormNext className="text-white text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WhatOurCustomersSay
