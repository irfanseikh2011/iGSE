import React, { useEffect} from 'react'
import './Dashboard.css'
import logo from './bulb.png'
import avator from './avator.png'
import jwt from 'jsonwebtoken'
import { useNavigate, useLocation} from 'react-router-dom'

const AdminDashboard = () => {

  const navigate = useNavigate();
  const {state} = useLocation();
  const {data} = state;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      const user = jwt.decode(token);
      if(!user) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } else {
      navigate('/');
    } 
  }, [])


  const logoutFunc = () => {
    localStorage.clear();
    navigate('/');
  }



  return (
    <div className='dashboard-body'>
      <div className='dashboard-aside'>
          <div className='dashboard-logo'><img style={{width:"50px",margin:"10px"}} alt="logo" src={logo}/><h2> iGSE</h2></div>
          <div className='dashboard-aside-buttons'>
            <button className='dashboard-button'>Set Unit Price</button>
            <button className='dashboard-button'>View Bills</button>
            <button className='dashboard-button'>Statistics</button>
          </div>
          <div className='dashboard-logout'>
            <button onClick={logoutFunc} className='dashboard-button'>LOGOUT</button>
          </div>
      </div>
      <div className='dashboard-main'>
         <div className='dashboard-main-profile-div'>
            <div className='space-hidden'>space</div>
            <div className='identity-div'><div className='overview-avator admin-pic'><img src={avator} alt="avator"/></div>
            <div className='overview-name'><h3>ADMINISTRATOR</h3></div></div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
         </div>
         {/* <div className='dashboard-profile-details'>
            <div className='dashboard-detail'><h3>Username: </h3><h3 className='dashboard-detail-data'>ADMIN</h3></div>
            <div className='dashboard-detail'><h3>Address: </h3><h3 className='dashboard-detail-data'>{data.address}</h3></div>
            <div className='dashboard-detail'><h3>Property Type: </h3><h3 className='dashboard-detail-data'>{data.propertyType}</h3></div>
            <div className='dashboard-detail'><h3>Number of Rooms: </h3><h3 className='dashboard-detail-data'>{data.numberOfRooms}</h3></div>
            <div className='dashboard-detail'><h3>Total Credits Left: </h3><h3 className='dashboard-detail-data'>£{data.balance}</h3></div>
         </div> */}

      </div>
    </div>
  )
}

export default AdminDashboard