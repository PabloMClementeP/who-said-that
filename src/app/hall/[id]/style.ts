import styled from "styled-components";

export const HallWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: calc(100vh - 100px);
  color: #fff;
`;

export const HallTitle = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const UsersContainer = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  list-style: none;
`;

export const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  min-width: 150px;
  user-select: none;

  li {
    font-size: 1.5rem;
    text-transform: capitalize;
    color: #000;
  }
`;
