import React from 'react'
import ScheduleEmpty from '../../assests/images/emtyschedule.png'
import Light from '../../assests/images/img1.png'
import { emit } from 'process'
export default function () {
  return (
    <div className="flex  justify-center  items-center mt-20 flex-col">
      <img src={ScheduleEmpty} alt="Personne" className=" w-[144px] h-[160px] " />
      {/* text div */}
      <div className="flex flex-col items-center mt-3">
        <div className="font-bold">It is Empty</div>
        <div className="text-gray-500">No accounts associated yet!</div>
      </div>
      {/* image div */}
      <div>{/* <img src={Light} alt="Personne" className=" w-[144px] h-[160px] " /> */}</div>
    </div>
  )
}
