import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import TextField from "@mui/material/TextField";
import classes from "./Login.module.css";
import axios from "axios";

const Login = () => {
  const { REACT_APP_DOMAIN } = process.env;

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    axios
      .get(`${REACT_APP_DOMAIN}api/auth/user`, {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          navigate("/home");
          console.log("success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const loginHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        `${REACT_APP_DOMAIN}api/auth/signin`,
        {
          userId: userName,
          password: password,
          fcmToken: "dlkalkjdlfaldjf",
        },
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200 || response.code === 200) {
          navigate("/home");
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("id", response.data.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={classes.loginContainer}>
      <h4>Enter user ID</h4>
      <p>Please enter your user ID</p>
      <form>
        <TextField
          id="standard-basic"
          label="Login"
          variant="standard"
          type="text"
          className={classes.input}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <div className={classes.passwordBox}>
          <TextField
            id="standard-basic"
            label="Password"
            variant="standard"
            className={classes.input}
            type={open ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {open ? (
            <AiFillEye className={classes.icon} onClick={() => setOpen(!open)}></AiFillEye>
          ) : (
            <AiFillEyeInvisible
              className={classes.icon}
              onClick={() => setOpen(!open)}></AiFillEyeInvisible>
          )}
        </div>

        <button onClick={loginHandler} className={classes.btn}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Login;
