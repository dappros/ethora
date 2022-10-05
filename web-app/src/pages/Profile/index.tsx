import * as React from 'react'
import Container from '@mui/material/Container';
import { useState } from '../../store'
import { useParams } from 'react-router-dom'
import MyProfile from './MyProfile'
import OtherProfile from './OtherProfile'

export default function Profile() {
  const user = useState((state) => state.user)
  const params: {wallet: string} = useParams()

  if (user.walletAddress === params.wallet) {
    return (
      <MyProfile></MyProfile>
    )
  } else {
    return (
      <OtherProfile walletAddress={params.wallet}></OtherProfile>
    )
  }
}