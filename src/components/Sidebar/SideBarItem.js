import React from 'react'

export default function SideBarItem({ image, bgColor, name, posts, percentage }) {
  return (
    <div
      className={`h-20 mt-3 w-full ${bgColor}  rounded-lg flex items-center space-x-2 pl-3 pr-3 `}
    >
      <img src={image} alt="Personne" className="  " />
      {/* middel texts */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <div>{name}</div>
          <div>{posts} posts</div>
        </div>
        {/* rating texts  */}
        <div className=" flex items-center flex-col">
          <div className="text-xs">+{percentage}%</div>
          <div className="text-xs">per month</div>
        </div>
      </div>
    </div>
  )
}
