import styled from "styled-components";

export const Sidebar = styled.div`
  background-color: #fff;
  min-width: 300px;
  height: calc(100vh - 100px);
  position: absolute;
  right: 0;
  display: "flex";
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const User = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
