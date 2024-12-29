// import React, { useState } from 'react'
// import EditImage from '../../assests/images/settings/edit.png'
// import ToolsImage from '../../assests/images/settings/brush.png'
// import AddImage from '../../assests/images/settings/add.png'
// import MicrophoneImage from '../../assests/images/settings/microphone.png'
// import { FaPlus } from 'react-icons/fa'
// import Cross from '../../assests/images/cross.png'
// import VoiceGenerator from './VoiceGenerator/VoiceGenerator'
// import styles from './Setting.module.css'

// const Setting = ({ onClose }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const openAudioModal = () => {
//     setIsModalOpen(true)
//   }

//   const closeAudioModal = () => {
//     setIsModalOpen(false)
//   }

//   return (
//     <div className={styles.container}>
//       <button onClick={onClose} className={styles.closeButton} aria-label="Close settings">
//         <img src={Cross} alt="Close button" className={styles.closeIcon} />
//       </button>

//       <h2 className={styles.title}>SETTINGS</h2>

//       <div className={styles.content}>
//         <div className={styles.topSection}>
//           <div className={styles.logoSection}>
//             <div className={styles.logoCircle}>
//               <FaPlus className={styles.plusIcon} />
//               <p className={styles.logoText}>Add your logo</p>
//             </div>
//           </div>

//           <div className={styles.bioSection}>
//             <div className={styles.bioHeader}>
//               <h2 className={styles.bioTitle}>Your Bio :</h2>
//               <img src={EditImage} className={styles.editIcon} alt="Edit" />
//             </div>
//             <p className={styles.bioText}>
//               Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
//               laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
//               architecto beatae vitae dicta sunt explicabo.
//             </p>
//           </div>
//         </div>

//         <div className={styles.toolsSection}>
//           <div className={styles.toolsHeader}>
//             <img className={styles.toolsIcon} src={ToolsImage} alt="Tools" />
//             <p className={styles.toolsTitle}>Tools</p>
//           </div>

//           <div className={styles.toolsContent}>
//             <div className={styles.toolItem}>
//               <div className={styles.toolIconWrapper}>
//                 <img className={styles.toolIcon} src={AddImage} alt="Add" />
//               </div>
//               <p className={styles.toolText}>Nich</p>
//             </div>

//             <div className={styles.toolItem}>
//               <div className={styles.toolIconWrapper} onClick={openAudioModal}>
//                 <img className={styles.toolIcon} src={MicrophoneImage} alt="Microphone" />
//               </div>
//               <p className={styles.toolText}>Audio</p>
//             </div>
//           </div>

//           <div className={styles.hashtagSection}>
//             <p className={styles.hashtagTitle}># Hashtags</p>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && <VoiceGenerator onClose={closeAudioModal} />}
//     </div>
//   )
// }

// export default Setting
