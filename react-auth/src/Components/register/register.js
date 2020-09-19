import React, { useState } from "react";
import styled from "styled-components";

function Register({ authentication }) {
  const [switchSign, setSwitchSign] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pasrseUserDate = (fn) => ({target:{value}}) => fn(value)

  const switchButton = () => setSwitchSign(!switchSign)

  const userDate = () => {
    return {
      email,
      password,
    };
  };

  const submitForm = (e) => {
    e.preventDefault();
    authentication(switchSign, userDate())
  };

  return (
    <Form onSubmit={submitForm}>
      <InfoInput
        required
        type="email"
        value={email}
        placeholder="Email"
        onChange={pasrseUserDate(setEmail)}
      />
      <InfoInput
        required
        type="password"
        value={password}
        placeholder="Password"
        onChange={pasrseUserDate(setPassword)}
      />
      <Sign type="submit">{switchSign ? "Sign in" : "Sign up"}</Sign>
      <Switch type="button" onClick={switchButton}>
        {switchSign ? "Register" : "Log into Existing Account"}
      </Switch>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`;
const InfoInput = styled.input`
  width: 300px;
  height: 30px;
  margin-bottom: 30px;
  padding: 5px;
`;
const Sign = styled.button`
  width: 200px;
  height: 30px;
  font-size: 16px;
  color: black;
  cursor: pointer;
  :hover {
    border: 3px solid black;
  }
`;

const Switch = styled.button`
  font-size: 12px;
  color: black;
  border: none;
  outline: none;
  background-color: inherit;
  cursor: pointer;
  margin-top: 20px;
`;

export default Register;
