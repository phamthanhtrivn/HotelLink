import { AuthContext } from '@/context/AuthContext'
import React, { useContext } from 'react'

const Home = () => {
  const { user } = useContext(AuthContext)

  console.log(user);
  
  return (
    <div>Home</div>
  )
}

export default Home