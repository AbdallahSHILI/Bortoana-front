import React from 'react'
import SideBarItem from '../Sidebar/SideBarItem'
import logo1 from '../../assests/images/Logo.png'
import logo2 from '../../assests/images/Logolinkedin.png'
import logo3 from '../../assests/images/Logoinstgrame.png'
import logo4 from '../../assests/images/Logoyoutube.png'
import logo5 from '../../assests/images/Logowhatsup.png'
import '../../css/sidebar.css'; 
import ScheduleEmpty from '../Sidebar/ScheduleEmpty'
export default function SideBar() {


    const items = [
        {
          image: logo1,
          bgColor: 'bg-sky-500',
          name: 'Facebook',
          posts: 12,
          percentage: 7.34
        },
        {
          image: logo2,
          bgColor: 'bg-green-500',
          name: 'Instagram',
          posts: 20,
          percentage: 5.21
        },
        {
          image: logo3,
          bgColor: 'bg-yellow-500',
          name: 'Twitter',
          posts: 8,
          percentage: 9.15
        },
        {
            image: logo3,
            bgColor: 'bg-yellow-500',
            name: 'Twitter',
            posts: 8,
            percentage: 9.15
          },  {
            image: logo3,
            bgColor: 'bg-pink-500',
            name: 'Twitter',
            posts: 8,
            percentage: 9.15
          },
          {
            image: logo3,
            bgColor: 'bg-pink-500',
            name: 'Twitter',
            posts: 8,
            percentage: 9.15
          },
          {
            image: logo4,
            bgColor: 'bg-red-500',
            name: 'Youtube',
            posts: 4,
            percentage: 10.15
          },
          {
            image: logo5,
            bgColor: 'bg-green-300',
            name: 'Whatsup',
            posts: 4,
            percentage: 10.15
          }
      ];
  return (
    <div className=' h-full'>
    <div   style={{background: "#1F1F1F" ,  height:  items.length === 0 ? "480px" : "100%"}} className=' w-80  rounded-lg '>
        {/* content */}
      <div  style={{ margin: '16px 0 0 0' }} className='pl-5 pr-5 pt-5  w-full'>
        <div className='text-white'> My Schedule</div>
        {/* list items */}
        <div  style={{ height:'520px'}}className=' overflow-y-auto scrollbar-hide '>
        {items.length === 0 ? (
              <ScheduleEmpty />
            ) : (
        items.map((item, index) => (
        <SideBarItem
          key={index}
          image={item.image}
          bgColor={item.bgColor}
          name={item.name}
          posts={item.posts}
          percentage={item.percentage}
        />
        )
      ))}
    
        </div>
       
      </div>
      
    </div>
    </div>
  )
}

