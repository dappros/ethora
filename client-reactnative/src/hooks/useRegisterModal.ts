import { useState } from "react"

export const useRegisterModal = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  return {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    modalOpen,
    setModalOpen,
  }
}
