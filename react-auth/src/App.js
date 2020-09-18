import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";

import Register from "./Components/register/register";
import Profile from "./Components/profile/profile";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [statusIn, setStatusIn] = useState(false);
  const [validToken, setValidToken] = useState("");

  useEffect(() => {
    // checkLocal();
  });

  const checkLocal = () => {
    if (localStorage.getItem("refreshToken")) {
      usesRefreshToken(localStorage.getItem("refreshToken"));
    }
  };

  const instance = axios.create({
    baseURL: "http://142.93.134.108:1111",
  });

  const res = () => console.log('a');

  axios.interceptors.request.use(
    config => {
    console.log('qwwwwwwwwwwwwwwwqd');
    console.log(config);

      const token = localStorage.getItem("refreshToken")
      if (token) {
        usesRefreshToken(localStorage.getItem("refreshToken"));
      }
      // config.headers['Content-Type'] = 'application/json';
      return config;
  },
  res())

  const pasrseLocalStorage = (refreshToken) =>
    localStorage.setItem("refreshToken", refreshToken);

  const signUp = async (info) => {
    try {
      const response = await instance.post("/sign_up", info);
      console.log("👉 реєстрація", response);
      return response;
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const response = await instance.post(
        `/login?email=${email}&password=${password}`
      );
      console.log("👉 перевірка", response);
      return response;
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const usesAccessToken = async (token) => {
    try {
      const response = await instance.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("👉 accessToken:", response);
      check(response);
      return response;
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const usesRefreshToken = async (refreshToken) => {
    try {
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
      parseTokens(response);
      return response;
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const check = ({ data }) => {
    data.statusCode === 200 ? setValidToken(data.body.message) : checkLocal();
    setStatusIn(data.statusCode === 200 ? true : false);
  };

  const deleteToken = () => {
    setAccessToken("");
    setStatusIn(false);
    localStorage.removeItem("refreshToken");
  };

  const authentication = (switchSign, user) => {
    console.log(switchSign);
    return !switchSign ? signUp(user).then(() => signIn(user)) : signIn(user);
  };

  const parseTokens = ({ data }) => {
    if (data.statusCode === 200) {
      const { access_token, refresh_token } = data.body;
      setAccessToken(access_token);
      usesAccessToken(access_token);
      pasrseLocalStorage(refresh_token);
    } else {
      alert("wrong password or email");
    }
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
              usesAccessToken={usesAccessToken}
              usesRefreshToken={usesRefreshToken}
              accessToken={accessToken}
              validToken={validToken}
            />
          )}
        />
        <Route
          path="/register"
          render={() => (
            <Register
              authentication={authentication}
              parseTokens={parseTokens}
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
