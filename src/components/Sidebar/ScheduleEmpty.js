import React from 'react'
import ScheduleEmpty from '../../assests/images/emptyschedule.svg'

export default function EmptySchedule() {
  return (
    <div className="flex  justify-center  items-center py-12 flex-col">
      <img alt="emptyShedule" src={ScheduleEmpty} className=" w-[260px] h-[180px] " />
      <div className="flex flex-col gap-2 items-center mt-3">
        <div className="font-bold text-white text-xl">It is Empty</div>
        <div className="text-gray-400 text-lg">No accounts associated yet!</div>
      </div>
    </div>
  )
}
