import React from 'react'
import {FaUser,FaPen,FaBell,FaPhoneAlt} from 'react-icons/fa'
import {BiPencil} from 'react-icons/bi'
import classes from  './Profile.module.css'
const Profile = () => {
  return (
    <div className={classes.profileContainer}>
    <div className={classes.user}>
        <div className={classes.userIcon}>
        <FaUser style={{color:'white',fontSize:"30px"}}></FaUser>
        </div>
        <div className={classes.penIcon}>
        <FaPen style={{color:'red'}}></FaPen>
        </div>
      <div className={classes.name}>
        <h4>John</h4>
        <span>Open Profile</span>
      </div>
    </div>
    <div className={classes.notiContainer}>
      <div className={classes.notification}>
        <FaBell style={{color:'gray'}}></FaBell>
        <p>Notifications</p>
      </div>
      <div className={classes.notification}>
        <FaPhoneAlt style={{color:'gray'}}></FaPhoneAlt>
        <p>Calls</p>
      </div>
    </div>
    {/* <button className={classes.btn}>Logout</button> */}
    </div>
  )
}

export default Profile