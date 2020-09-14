import React, { useState } from "react";
import styled from "styled-components";

function Register({ sign, getToken }) {
  const [switchSign, setSwitchSign] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkEmail = ({ target }) => {
    setEmail(target.value);
  };
  const checkPassword = ({ target }) => setPassword(target.value);

  const userDate = () => {
    return {
      email,
      password,
    };
  };

  const submitForm = (e) => {
    e.preventDefault();
    sign(switchSign, userDate()).then((res) => {
      getToken(res);
    });
  };

  return (
    <Form onSubmit={submitForm}>
      <InfoInput
        required
        type="email"
        value={email}
        placeholder="Email"
        onChange={checkEmail}
      />
      <InfoInput
        required
        type="password"
        value={password}
        placeholder="Password"
        onChange={checkPassword}
      />
      <Sign type="submit">{switchSign ? "Sign in" : "Sign up"}</Sign>
      <Switch type="button" onClick={() => setSwitchSign(!switchSign)}>
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
