import React, { useEffect } from "react";
import styled from "styled-components";

function Profile({
  deleteToken,
  usesRefreshToken,
  usesAccessToken,
  userDate: { email },
  accessToken,
}) {
  useEffect(() => {
    const check = setInterval(() => {
      usesAccessToken(accessToken);
    }, 6000);
    return function cleanup() {
      clearInterval(check);
    };
  });

  return (
    <Info>
      <UserEmail>{email}</UserEmail>
      <button onClick={deleteToken} type="button">
        Exit
      </button>
      <button onClick={usesRefreshToken} type="button">
        refresh
      </button>
      <button onClick={() => usesAccessToken(accessToken)} type="button">
        access
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
