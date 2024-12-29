import React, { useEffect } from 'react'

const Modal = ({
  isOpen,
  onClose,
  children,
  width = 'w-[500px]', // default width
  height = 'h-auto' // default height
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Prevent click inside modal from closing
  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 "
      onClick={onClose}
    >
      <div
        className={` bg-[#303030] border border-white/20 rounded-lg shadow-lg
          transform transition-all top-1/2 mx-[15%] duration-200 ease-in-out
          hover:border-white/30 flex flex-col`}
        onClick={handleModalClick}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
