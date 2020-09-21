import React from "react";
import styled from "styled-components";

function Profile({
  deleteToken,
  validToken
}) {

  return (
    <Info>
      <UserEmail>{validToken}</UserEmail>
      <button onClick={deleteToken} type="button">
        Exit
      </button>
    </Info>
  );
}

const UserEmail = styled.p`
  text-align: center;
  font-size: 20px;
  color: white;
  padding: 20px;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`;

export default Profile;
