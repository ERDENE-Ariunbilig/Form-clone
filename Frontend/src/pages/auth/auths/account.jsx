import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from "./../../../api"
import "./css/account.css"

export default function Account({setLogged}) {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)

  const handleLogout = () => {
    sessionStorage.removeItem('User')
    localStorage.removeItem('logged')
    localStorage.removeItem('User')
    navigate('/', { replace: true })
    setLogged(false)
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('User'))
    const userId = user?.id

    if (!userId) {
      console.warn("userId олдсонгүй")
      return
    }

    getUser(userId)
      .then(data => {
        setUserData(data)
      })
      .catch(err => {
        console.error("Алдаа:", err)
      })
  }, [navigate])

  return (
    <div className="user-page">
  <h2 className="user-heading">Хэрэглэгчийн хуудас</h2>
  {userData ? (
    <div className="user-info">
      <p className="user-name">Нэр: {userData.name}</p>
      <p className="user-email">И-мэйл: {userData.email}</p>
      {/* Хүсвэл өөр мэдээлэл нэм */}
    </div>
  ) : (
    <p className="loading-text">Уншиж байна...</p>
  )}

  <button onClick={handleLogout} className="logout-button">
    Гарах
  </button>
</div>

  )
}
