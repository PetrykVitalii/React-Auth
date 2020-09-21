import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";

import Register from "./Components/register/register";
import Profile from "./Components/profile/profile";

function App() {
  const [statusIn, setStatusIn] = useState(false);
  const [validToken, setValidToken] = useState("");

  useEffect(() => {
    !validToken && checkLocal(true);
  });

  const instance = axios.create({
    baseURL: "http://142.93.134.108:1111",
  });

  instance.interceptors.response.use(
    (config) => {
      const {url} = config.config
      if(url === "/refresh"){
        config.data.statusCode === 401 || config.data.statusCode === 403
          ? alert("токен застарів")
          : parseTokens(config)
      }
      if(url.includes("/login?email")){
        config.data.code === 1012
          ? config.config.url.includes("/login?email") && alert(config.data.message)
          : parseTokens(config)
      }
      if(url === ("/me")){
        if(config.data.statusCode === 401){
          checkLocal(false)
          setStatusIn(false)
        }
        else{
          setValidToken(config.data.body.message)
          setStatusIn(true)
        }    
      }
      return config;
    }
  );


  const checkLocal = (status) => {
    if (localStorage.getItem("accessToken")) {
      status
        ? usesAccessToken(localStorage.getItem("accessToken"))
        : usesRefreshToken(localStorage.getItem("refereshToken"))
    }
  };

  const pasrseLocalStorage = ({access_token,refresh_token}) => {
    localStorage.setItem("accessToken", access_token)
    localStorage.setItem("refereshToken", refresh_token)
  }

  const signUp = async (info) => {
    const response = await instance.post("/sign_up", info);
    console.log("👉 реєстрація", response);
    return response;
  };

  const signIn = async ({ email, password }) => {
    const response = await instance.post(
      `/login?email=${email}&password=${password}`
    );
    console.log("👉 перевірка", response);
    return response;
  };

  const usesAccessToken = async (token) => {
    const response = await instance.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("👉 accessToken:", response);
    return response;
  };

  const usesRefreshToken = async (refreshToken) => {
    const response = await instance.post(
      "/refresh",
      {
        Authorization: `Bearer ${refreshToken}`,
      },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    console.log("👉 refreshToken:", response);
    return response;
  };

  const deleteToken = () => {
    setStatusIn(false);
    localStorage.removeItem("tokens");
  };

  const authentication = (switchSign, user) => {
    return !switchSign ? signUp(user).then(() => signIn(user)) : signIn(user);
  };

  const parseTokens = ({ data }) => {
    const { access_token} = data.body;
    usesAccessToken(access_token);
    pasrseLocalStorage(data.body);
  };

  return (
    <Main>
      <Router>
        {statusIn ? (
          <Redirect to="/profile" />
        ) : (
          <Redirect from="/" to="/register" />
        )}
        <Route
          path="/profile"
          render={() => (
            <Profile
              deleteToken={deleteToken}
              validToken={validToken}
            />
          )}
        />
        <Route
          path="/register"
          render={() => (
            <Register
              authentication={authentication}
            />
          )}
        />
      </Router>
    </Main>
  );
}

const Main = styled.main`
  width: 600px;
  min-height: 400px;
  padding: 40px;
  margin: 100px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: #545656;
`;

export default App;
