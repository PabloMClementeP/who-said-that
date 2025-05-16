import styled from "styled-components";

export const FormWrapper = styled.div`
  height: calc(100vh - 100px);
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormTitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

export const ButtonWrapper = styled.div`
  margin-top: 2.5rem;
`;

export const RoomsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 2.5rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #fff;
    font-weight: bold;
  }
`;

export const RoomList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const RoomItem = styled.li`
  background-color: #fff;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    font-weight: bold;
  }
`;
