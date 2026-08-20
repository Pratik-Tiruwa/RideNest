import React from 'react'

type propType={  
    isOpen: boolean, 
    onClose : () => void
}

const AuthModel = ({isOpen, onClose}:propType) => {
  return (
    <div>AuthModel</div>
  )
}

export default AuthModel