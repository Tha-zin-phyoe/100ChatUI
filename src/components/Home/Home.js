import React, { useEffect, useState } from "react";
import { BsFillGearFill, BsArrowLeft, BsSearch, BsEmojiLaughing } from "react-icons/bs";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FaUser, FaPen, FaBell, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAttachFile, MdSend } from "react-icons/md";
import img from "../../assets/cat.png";
import classes from "./Home.module.css";
import io from "socket.io-client";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const socket = io.connect("https://www.accesses.app");

const Home = () => {
  const [state, setState] = React.useState({
    right: false,
  });
  const { REACT_APP_DOMAIN } = process.env;
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("accessToken");
  const [channels, setChannels] = useState([]);
  const [oldmessages, setOldMessages] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [change,setChange] = useState(true)

  console.log(name);
  console.log(phone);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        <div className={classes.channelInfoContainer}>
          <img
            src=""
            alt=""
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "1px solid #7f7f7f",
              margin: "10px 80px",
            }}
          />
          <div style={{ marginLeft: "20px", fontSize: "14px", marginTop: "40px" }}>
            Channel Name
          </div>
          <p style={{ textAlign: "center", fontWeight: 700 }}>{title.name}</p>
          <span style={{ margin: "20px", fontSize: "14px", fontWeight: "600", color: "#7f7f7f" }}>
            Users
          </span>
        </div>
      </List>
    </Box>
  );

  useEffect(() => {
    axios
      .get(`${REACT_APP_DOMAIN}api/auth/user`, {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setName(res.data.results.name);
        setPhone(res.data.results.phone);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${REACT_APP_DOMAIN}api/chat/chat-lists/${id}`)
      .then((res) => setChannels(res.data.data))
      .catch((err) => console.log(err));
  }, [change]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // console.log(data.data);
      setOldMessages((oldmessages) => [...oldmessages, data.data]);
    });
  }, [socket]);
  useEffect(()=>{
     socket.on('getNotification', (data) => {
  console.log("TZ")
   console.log(data)
   });

  },[socket])

  // useEffect(() => {
  //   oldmessages.reverse();
  // }, [oldmessages]);
  // oldmessages.reverse();
  console.log("old messages", oldmessages[0]);

  const sendHandler = (e) => {
    setMessage("");
    

  
    if (title.name === undefined) {
      alert("Please Select A Channel");
    } else {
      e.preventDefault();
      
      axios
        .post(`${REACT_APP_DOMAIN}api/chat`, {
          channel: {
            channelId: title.id,
            channelName: title.name,
          },
          media: null,
          mension: false,
          mensionUser: [],
          message: message,
          replyMessage: null,
          replyUseName: null,
          seenUser: [],
          time: new Date().toLocaleTimeString(),
          type: 0,
          user: {
            userId: id,
            userName: name,
          },
        })
        .then((response) => {
          if (response.data.status === "success") {
            setChange(!change)
            console.log("send message");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      
    }
  

  };
  console.log("channel name", title.name);

  return (
    <div className={classes.home}>
      <div className={classes.container}>
        {/* Sidebar */}
        <div className={classes.sidebar}>
          <div>
            <FormControl>
              <Select
                sx={{
                  width: 50,
                  height: 30,
                  marginRight: 15,
                  border: "none",
                  color: "black",
                  outline: "none",
                  borderRadius: "20px",
                }}>
                <div className={classes.menu}>
                  <MenuItem>
                    <div className={classes.user}>
                      <div className={classes.userIcon}>
                        <FaUser style={{ color: "white", fontSize: "30px" }}></FaUser>
                      </div>
                      <div className={classes.name}>
                        <h4>{name}</h4>
                        <span>{phone}</span>
                      </div>
                    </div>
                  </MenuItem>

                  <MenuItem>
                    <div className={classes.notiContainer}>
                      <div className={classes.notification}>
                        <FaBell style={{ color: "gray" }}></FaBell>
                        <p>Notifications</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className={classes.notification}>
                      <FaPhoneAlt style={{ color: "gray" }}></FaPhoneAlt>
                      <p>Calls</p>
                    </div>
                  </MenuItem>

                  <MenuItem
                    onClick={(e) => {
                      localStorage.clear();
                      navigate("/");
                    }}>
                    <div className="">Log Out</div>
                  </MenuItem>
                </div>
              </Select>
            </FormControl>
          </div>
          {/* Latest UI Update */}
          <div className={classes.channel}>
            <div className={classes.head}>
              <h4>Channels</h4>
              <BsFillGearFill></BsFillGearFill>
            </div>
            <div className={classes.sidebarHeight}>
              {channels?.length === 0 ? (
                <p>There is no channels</p>
              ) : (
                channels.map((channel, index) => {
                  // console.log("HI");
                  // console.log(channel);
                  // const [arr] = channel?.latest_messages;
                  // const channelId = arr?.channel?.channelId;
                  // console.log(channelId);
                  // console.log(arr);
                  return (
                    <div
                      className={classes.container1}
                      key={index}
                      onClick={() => {
                        console.log(channel.id);
                        console.log("channel data", channel);
                        setTitle({
                          name: channel?.name,
                          id: channel?.id,
                        });
                        axios
                          .get(`${REACT_APP_DOMAIN}api/chat/messages/channel/${channel.id}`)
                          .then((res) => setOldMessages(res.data.data.reverse()))
                          .catch((err) => console.log(err));
                      }}>
                      <div className={classes.text}>
                        <div>
                          <img src={img} style={{ width: "50px" }}></img>
                        </div>
                        <div className={classes.team}>
                          <p style={{ fontSize: "14px", fontWeight: "bold" }}>{channel?.name}</p>
                          <span
                            style={{ fontSize: "14px", fontWeight: "bold", marginRight: "10px" }}>
                            {channel?.latest_messages[0]?.user?.userName}
                          </span>
                          <span>{channel?.latest_messages[0]?.message}</span>
                          <span
                            style={{ fontSize: "10px", marginLeft: "90px" }}
                            className={classes.date}>
                            {channel?.latest_messages[0].time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {/* Sidebar */}
        {/* Chat */}
        <div className={classes.chat}>
          {/* Header */}
          <div className={classes.header}>
            <div className={classes.channel1}>
           
              {/* <img src={img} style={{ width: "30px", height: "30px" }}></img> */}
              {title.name !== "" ? <p>{title.name}</p> : <p>Please Select Channel</p>}
            </div>

            <div className="">
              <BsSearch></BsSearch>
              {title.name === undefined ? (
                <div></div>
              ) : (
                ["right"].map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>
                      <InfoIcon />
                    </Button>
                    <SwipeableDrawer
                      anchor={anchor}
                      open={state[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                      onOpen={toggleDrawer(anchor, true)}>
                      {list(anchor)}
                    </SwipeableDrawer>
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

          {/* messages section */}
          <ScrollToBottom>
            <div className={classes.messageContainer1}>
              {oldmessages.map((oldmessage, index) => {
                return (
                  <div
                    key={index}
                    className={
                      oldmessage?.user?.userName === name ? `${classes.me}` : `${classes.other}`
                    }>
                    <div className={classes.textContainer}>
                      <div className={classes.cir}>{oldmessage?.user?.userName?.slice(0, 1)}</div>
                      <div>
                        {oldmessage.media ? (
                          <img src={oldmessage.media} className={classes.image}></img>
                        ) : (
                          <>
                            {" "}
                            <p className={classes.chat}>{oldmessage.message}</p>
                            <span className={classes.time}>{oldmessage.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollToBottom>

          {/* message section end */}

          {/* Bottom */}
          <form className={classes.bottom} onSubmit={sendHandler}>
            <input
              className={classes.input}
              placeholder="Type a Message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}></input>
            <div className={classes.send}>
              <BsEmojiLaughing></BsEmojiLaughing>
              <input type="file" style={{ display: "none" }} id="file"></input>
              <label htmlFor="file" style={{ marginLeft: "20px" }}>
                <MdOutlineAttachFile></MdOutlineAttachFile>
              </label>
            </div>
            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={sendHandler}>
              <MdSend></MdSend>
            </button>
          </form>
        </div>
        {/* Chat */}
      </div>
    </div>
  );
};

export default Home;
