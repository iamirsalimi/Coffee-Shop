import { useState } from 'react';
import Title from '@/components/modules/Title/Title'
import Link from 'next/link';

function BookingForm() {
    const [fullname, setFullname] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [numberOfGuests, setNumberOfGuests] = useState('')
    const [description, setDescription] = useState('')

    const getMinDate = () => {
        let dtToday = new Date();

        let month = dtToday.getMonth() + 1;
        let day = dtToday.getDate();
        let year = dtToday.getFullYear();

        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        return `${year}-${month}-${day}`;
    }

    return (
        <div className="py-16 w-full min-h-screen bg-black">
            <div className="container mx-auto px-5 py-10 w-full h-full flex flex-col gap-8 items-start justify-start">
                <Title title="Book A Table" />
                <p className="text-white text-lg text-center sm:text-justify">Please fill in the details below to reserve your table. We’ll confirm your booking as soon as possible</p>
                <form className="w-full flex flex-col justify-center items-center lg:items-start gap-7">
                    <div className="w-full flex flex-col gap-5">
                        <div className="flex flex-col gap-5 p-4 rounded-xl bg-green-700">
                            <h2 className="text-white font-bold text-xl text-center md:text-left">Good to Know</h2>
                            <ul className="flex flex-col gap-2 items-center md:items-start">
                                <li className="text-gray-200">Bookings can be made up to 7 days in advance</li>
                                <li className="text-gray-200">Please arrive on time to keep your reservation</li>
                                <li className="text-gray-200">For large groups, contact us directly</li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-7">

                            <div className="w-full relative select-none">
                                <input type="text" value={fullname} onChange={e => setFullname(e.target.value)} className="w-full rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors" maxLength={20} required />
                                <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">fullname</span>
                            </div>

                            <div className="w-full relative select-none">
                                <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors" maxLength={20} required />
                                <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">Phone Number</span>
                            </div>

                            <div className="w-full relative select-none">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    min={getMinDate()}
                                    className="w-full rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                                />
                                <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">Date</span>
                            </div>

                            <div className="w-full relative select-none">
                                <input
                                    type="time"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    className="w-full rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                                />
                                <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">time</span>
                            </div>

                            <div className="md:col-start-1 md:col-end-3 w-full relative select-none">
                                <input
                                    type="number"
                                    value={numberOfGuests}
                                    onChange={e => setNumberOfGuests(e.target.value)}
                                    className="w-full rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5" min={0} max={30}
                                />
                                <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">Number Of Guests</span>
                            </div>
                            <div className="md:col-start-1 md:col-end-3  w-full relative select-none">
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full min-h-28 rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5" minLength={8} maxLength={16}
                                ></textarea>
                                <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">Description</span>
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-md cursor-pointer bg-sky-700 hover:bg-sky-600 transition-colors text-white font-bold">Reserve Table</button>
                    </div>
                </form>
                <div className="w-full text-center flex flex-col items-center gap-2">
                    <p className="text-center font-bold text-gray-400">Need help with your reservation?</p>
                    <p className="text-center font-bold text-white">Visit our <Link className="underline" href="/Contact">contact</Link> page or call us directly.</p>
                </div>
            </div>
        </div>
    )
}

export default BookingForm
