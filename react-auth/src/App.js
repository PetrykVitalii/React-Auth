import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";

import Register from "./Components/register/register";
import Profile from "./Components/profile/profile";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [userDate, setUserDate] = useState("");
  const [statusIn, setStatusIn] = useState(false);

  const signUp = async (info) => {
    try {
      const response = await axios.post(
        "http://142.93.134.108:1111/sign_up",
        info
      );
      console.log("👉 реєстрація", response);
      return response;
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const signIn = async ({ email, password }) => {
    setUserDate({ email });
    try {
      const response = await axios.post(
        `http://142.93.134.108:1111/login?email=${email}&password=${password}`
      );
      console.log("👉 перевірка", response);
      return response;
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const usesAccessToken = async (token) => {
    try {
      const response = await axios.get("http://142.93.134.108:1111/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("👉 accessToken:", response);
      check(response)
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const usesRefreshToken = async () => {
    console.log(refreshToken);
    try {
      const response = await axios.post(
        "http://142.93.134.108:1111/refresh",
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
      getToken(response);
      return response;
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const check = ({data:{statusCode}}) => {
    setStatusIn(statusCode === 200 ? true : false);
  }

  const deleteToken = () => {
    setAccessToken("");
    setRefreshToken("");
    setStatusIn(false)
  };

  const sign = (switchSign, user) => {
    return !switchSign ? signUp(user).then(() => signIn(user)) : signIn(user);
  };

  const getToken = ({ data }) => {
    if (data.statusCode === 200) {
      const { access_token, refresh_token } = data.body;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      usesAccessToken(access_token);
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
              userDate={userDate}
              deleteToken={deleteToken}
              usesAccessToken={usesAccessToken}
              usesRefreshToken={usesRefreshToken}
              accessToken={accessToken}
            />
          )}
        />
        <Route
          path="/register"
          render={() => <Register sign={sign} getToken={getToken} />}
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
