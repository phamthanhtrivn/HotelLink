import React from 'react'
import { useSelector } from 'react-redux';

const RoomTypeDetail = () => {
  const roomTypeFilter = useSelector(state => state.roomTypeSearch);

  console.log(roomTypeFilter);
  
  return (
    <div>RoomTypeDetail</div>
  )
}

export default RoomTypeDetail