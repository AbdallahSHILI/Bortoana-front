import React from 'react'
import SideBarItem from '../../Sidebar/SideBarItem'
import styles from './sidebar.module.css'
import ScheduleEmpty from '../../Sidebar/ScheduleEmpty'
import { sideBarItems } from './sideBarData'

export default function SideBar() {
  return (
    <div className={styles.container}>
      <div
        className={styles.sidebar}
        style={{ height: sideBarItems.length === 0 ? '480px' : '100%' }}
      >
        <div className={styles.content}>
          <div className={styles.title}>My Schedule</div>
          <div className={styles.listContainer}>
            {sideBarItems.length === 0 ? (
              <ScheduleEmpty />
            ) : (
              sideBarItems.map((item, index) => (
                <SideBarItem
                  key={index}
                  image={item.image}
                  bgColor={item.bgColor}
                  name={item.name}
                  posts={item.posts}
                  percentage={item.percentage}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
