import { useState } from 'react'

const useToast = () => {
  const [toasts, setToasts] = useState([])

  const show = (msg, type = 'success') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }

  return { toasts, show }
}

export default useToast
