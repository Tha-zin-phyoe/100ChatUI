import React ,{useEffect,useState}from 'react'
import { BsFillGearFill,BsArrowLeft,BsSearch,BsEmojiLaughing } from "react-icons/bs";
import {FaUser,FaPen,FaBell,FaPhoneAlt} from 'react-icons/fa'
import {MdOutlineAttachFile ,MdSend} from "react-icons/md";
import img from '../../assets/cat.png'
import classes from './Home.module.css'
import io from 'socket.io-client'
import axios from 'axios';
const socket = io.connect('https://www.accesses.app')
const Home = () => {
  const {REACT_APP_DOMAIN} = process.env;
  const id = localStorage.getItem("id")
  const [channels,setChannels] = useState([])
  let [oldmessages,setOldMessages] = useState([])
  console.log('FHJIGH')

 
  useEffect(()=>{
    axios.get(`${REACT_APP_DOMAIN}api/chat/chat-lists/${id}`)
   .then(res=>setChannels(res.data.data))
   .catch(err=>console.log(err))
       },[])
  useEffect(()=>{
    socket.on('receive_message',(data)=>{
      setOldMessages(oldmessages=>[...oldmessages,data.data])
    })

  },[socket])
  return (
    <div className={classes.home}>
    <div className={classes.container}>
      {/* Sidebar */}
      <div className={classes.sidebar}>
        <div className={classes.channel}>
          <div className={classes.head}>
          <h4>Messages</h4>
          <BsFillGearFill></BsFillGearFill>
          </div>
          {
              channels.map(channel=>{
                  const [arr] = channel.latest_messages;
                  const channelId = arr.channel.channelId;
                  console.log(channelId)
                  console.log(arr)
                  return   <div className={classes.container1} key={channel.id} onClick={
                    ()=>{
                      axios.get(`${REACT_APP_DOMAIN}api/chat/messages/channel/${channelId}`)
                      .then(res=>setOldMessages(res.data.data))
                      .catch(err=>console.log(err))
                    }
                  }>
                  <div className={classes.text}>
                      <div>
                      <img src={img} style={{width:'50px'}}></img>
                      </div>
                      <div className={classes.team}>
                      <p style={{fontSize:'16px'}}>{channel.name}</p>
                      <span style={{fontSize:'16px'}}>{arr.user.userName}:</span>
                      <span>{arr.message}</span>
                      </div>   
                      <div className={classes.date}>
                      <p style={{fontSize:'14px'}}>{arr.time}</p>
                    
                  </div>
                  </div>
                
                
              </div>
              })
            }
        </div>
      </div>
      {/* Sidebar */}
            {/* Chat */}
      <div className={classes.chat}>
        {/* Header */}
      <div className={classes.header}> 
            <div className={classes.channel1}>
            <BsArrowLeft style={{marginRight:'20px'}}></BsArrowLeft>
                <img src={img} style={{width:'30px',height:'30px'}}></img>
                 <p>IT Testing3 Channel</p>
           </div>
        <BsSearch></BsSearch>
        </div>
        {/* Cricle */}
        <div>
            <div className={classes.circle}>
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
            <div>E</div>
            </div>
        </div>
        {/* Message Container */}
        <div className={classes.messageContainer1}>
        {
          oldmessages.map(oldmessage=>{
            return (
              
              <div>
        <div className={classes.textContainer}>
            <div className={classes.cir}>E</div>
            <div>
              {
                oldmessage.media?<img src={oldmessage.media} className={classes.image}></img>:<>  <p className={classes.chat}>{oldmessage.message}</p> 
                <span className={classes.time}>{oldmessage.time}</span></>
              }
          
            </div>
        </div>
        <div className={classes.right}>
            <div></div>
            <div className={classes.seen}>
               <div>A</div>
               <div>B</div>
                <div></div>
            </div>
            </div>
        </div>
     
            )
          })
        }
        </div>
     
        {/* Bottom */}
        <div className={classes.bottom}>
        <input className={classes.input} placeholder="Type a Message"></input>
        <div className={classes.send}>
            <BsEmojiLaughing ></BsEmojiLaughing>
            <input type="file" style={{display:'none'}} id="file"></input>
            <label htmlFor='file' style={{marginLeft:'20px'}}>
                <MdOutlineAttachFile></MdOutlineAttachFile>
            </label>   
        </div>
        <MdSend ></MdSend>
       </div>
      </div>
      {/* Chat */}
     
    </div>
</div>
  )
}

export default Home