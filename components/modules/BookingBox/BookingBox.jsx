import React from 'react'

function BookingBox({ username, _id: id, fullname, guests, status, date, time, description, setShowModal, setCurrentId, setCurrentDate }) {
  const getMonth = date => {
    if (!date) return ''
    let registerDate = new Date(date)

    let day = registerDate.getDate();
    let month = registerDate.getMonth() + 1;
    let year = registerDate.getFullYear();
    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`
  }

  // console.log(status)
  return (
    <div className="p-4 border border-[#1f1f1f] rounded-2xl bg-[#0c0c0c] space-y-2">
      <div className="flex flex-col gap-2">
        <div className={`flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-gray-500`}>
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-gray-300 text-sm xs:text-base select-none">{username}</span>
            {status == "PENDING" && (
              <button
                onClick={e => {
                  setShowModal(true)
                  setCurrentId(id)
                  setCurrentDate(`${getMonth(date)} ${time}`)
                }}
                className="bg-red-500 border border-red-500 hover:bg-[#0c0c0c] hover:text-red-500 transition-colors py-1 px-4 text-xs cursor-pointer text-white rounded-xl"
              >Cancel</button>
            )}
          </div>
          <span className={`${status == 'CONFIRMED' ? 'text-green-500' : status == 'CANCELED' ? 'text-red-500' : 'text-yellow-500'} select-none text-xs xs:text-sm sm:text-base xs:ml-2`}>{status}</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap select-none">
          <div className="flex items-center gap-0.5 text-xs text-nowrap">
            <h2 className="text-gray-400">fullname : </h2>
            <span>{fullname}</span>
          </div>
          -
          <div className="flex items-center gap-0.5 text-xs text-nowrap">
            <h2 className="text-gray-400">Guests : </h2>
            <span>{guests}</span>
          </div>
          -
          <div className="flex items-center gap-0.5 text-xs text-nowrap">
            <h2 className="text-gray-400">Date : </h2>
            <span>{getMonth(date)} {time}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-white leading-relaxed select-none">
        {description}
      </p>
    </div>
  )
}

export default BookingBox