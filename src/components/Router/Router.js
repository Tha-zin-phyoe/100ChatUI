import React from "react";
import { Route, Routes } from "react-router";

import Login from "../Login/Login";
import Home from "../Home/Home";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/home" element={<Home />}></Route>
    </Routes>
  );
};

export default Router;
