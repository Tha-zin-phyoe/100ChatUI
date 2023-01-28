import React, { useEffect, useState, useRef } from "react";
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
import img from "../../assets/logo.png";
import classes from "./Home.module.css";
import io from "socket.io-client";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import EmojiPicker from "emoji-picker-react";

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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationSound from "../../assets/mixkit-interface-option-select-2573.wav";

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
  const [messageData, setMessageData] = useState("");
  // const [file, setFile] = useState();
  const navigate = useNavigate();
  const [noti, setNoti] = useState("");
  const [notiMessage, setNotiMessage] = useState("");

  const audioPlayer = useRef(null);

  // console.log(name);
  // console.log(phone);

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
        setName(res?.data?.results?.name);
        setPhone(res?.data?.results?.phone);
      })
      .catch((error) => {
        if (error.response.status === 401 || error.code === 401) {
          navigate("/");
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${REACT_APP_DOMAIN}api/chat/chat-lists/${id}`)
      .then((res) => {
        // console.log("channel response", res.data.data);
        if (res.data.status === "OK" || res.status === 200 || res.data.code === 200) {
          setChannels(res?.data?.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const dataSocket = data.data;
      console.log("send user name", name);
      console.log("socket received user name", data.data.user.userName);
      // console.log(data.data);
      setOldMessages((oldmessages) => [...oldmessages, data?.data]);
      // console.log("socket ", data.data);
      setNoti(data.data.user.userName);
      setNotiMessage(data.data.message);
      console.log(noti);
    });
  }, [socket]);

  // useEffect(() => {
  //   oldmessages.reverse();
  // }, [oldmessages]);
  // oldmessages.reverse();
  console.log("old messages", oldmessages);

  useEffect(() => {
    return () => {
      if (noti !== name) {
        toast(`${noti} : ${notiMessage}`);
        audioPlayer.current.play();
      }
    };
  }, [noti]);

  const sendHandler = (e) => {
    setMessageData("");
    if (title?.name === undefined) {
      alert("Please Select A Channel");
    } else {
      e.preventDefault();
      axios
        .post(`${REACT_APP_DOMAIN}api/chat`, {
          channel: {
            channelId: title?.id,
            channelName: title?.name,
          },
          media: null,
          mension: false,
          mensionUser: [],
          message: messageData,
          replyMessage: null,
          replyUserName: null,
          seenUser: [],
          time: new Date().toLocaleTimeString(),
          type: 0,
          user: {
            userId: id,
            userName: name,
          },
        })
        .then((response) => {
          if (response?.data?.status === "success" || response?.code === 200) {
            console.log("send message");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  console.log("channel name", title?.name);

  // const handleFileChange = (e: changeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFile(e.target.files[0]);
  //     setMessageData(file);
  //     console.log("file", file);
  //   }
  // };

  return (
    <div className={classes.home}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <audio ref={audioPlayer} src={NotificationSound} />
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
              {channels?.length !== 0 ? (
                channels?.map((item, index) => (
                  // console.log("HI");
                  // console.log(item);
                  // const [arr] = item?.latest_messages;
                  // const itemId = arr?.item?.itemId;
                  // console.log(itemId);
                  // console.log(arr);
                  <div
                    className={classes.container1}
                    key={index}
                    onClick={() => {
                      // console.log(item?.id);
                      // console.log("item data", item);
                      setTitle({
                        name: item?.name,
                        id: item?.id,
                      });
                      axios
                        .get(`${REACT_APP_DOMAIN}api/chat/messages/channel/${item?.id}`)
                        .then((res) => {
                          console.log(res);
                          if (res.status === 200 || res.data.status === 200) {
                            setOldMessages(res?.data?.data?.reverse());
                          }
                        })
                        .catch((err) => console.log(err));
                    }}>
                    <div className={classes.text}>
                      <div>
                        <img src={img} style={{ width: "50px" }} />
                      </div>
                      <div className={classes.team}>
                        <p style={{ fontSize: "14px", fontWeight: "bold" }}>{item?.name}</p>
                        <span style={{ fontSize: "14px", fontWeight: "bold", marginRight: "10px" }}>
                          {/* {item?.latest_messages[0]?.user?.userName} */}{" "}
                          {item.latest_messages[0]?.user.userName}
                        </span>
                        <span>
                          {item?.latest_messages[0]?.message}
                          {/* {item.latest_message[0].message} */}
                        </span>
                        <span
                          style={{ fontSize: "10px", marginLeft: "90px" }}
                          className={classes.date}>
                          {item?.latest_messages[0]?.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>There is no channels</p>
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
              <BsArrowLeft style={{ marginRight: "20px" }}></BsArrowLeft>
              {/* <img src={img} style={{ width: "30px", height: "30px" }}></img> */}
              {title?.name !== "" ? <p>{title?.name}</p> : <p></p>}
            </div>

            <div className="">
              <BsSearch></BsSearch>
              {title?.name === undefined ? (
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
              {oldmessages?.map((oldmessage, index) => {
                return (
                  <div
                    key={index}
                    className={
                      oldmessage?.user?.userName === name ? `${classes.me}` : `${classes.other}`
                    }>
                    <div className={classes.textContainer}>
                      <div className={classes.cir}>{oldmessage?.user?.userName?.slice(0, 1)}</div>
                      <div>
                        {oldmessage?.media ? (
                          <img src={oldmessage?.media} className={classes.image}></img>
                        ) : (
                          <>
                            {" "}
                            <p className={classes.chat}>{oldmessage?.message}</p>
                            <span className={classes.time}>{oldmessage?.time}</span>
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
              value={messageData}
              onChange={(e) => {
                setMessageData(e.target.value);
              }}></input>
            <div className={classes.send}>
              {/* <EmojiPicker Theme={auto} emojiStyle={apple} /> */}
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
