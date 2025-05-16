import styled from "styled-components";

export const Main = styled.div`
  height: calc(100vh - 100px);
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 200px;
  width: 200px;
  position: relative;
  color: #fff;
`;

export const Form = styled.form`
  background-color: rgb(255, 255, 255);
  padding: 1rem;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px;
  display: flex;
  flex-direction: column;
  width: fit-content;
  align-items: center;
`;

export const Input = styled.input`
  font-size: 1rem;
  min-height: 2.375rem;
  max-height: 48px;
  line-height: 2.375rem;
  text-align: center;
  max-width: 300px;
  min-width: 250px;
  color: rgb(51, 51, 51);
  outline: none;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 16px;
`;

export const CustomButton = styled.button<{
  $color?: string;
}>`
  font-weight: 700;
  min-height: 46px;
  padding-bottom: 2px;
  width: 100%;
  margin: 0px;
  margin-top: 0px;
  border: 0px;
  cursor: pointer;
  display: inline-block;
  vertical-align: bottom;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px,
    rgba(0, 0, 0, 0.25) 0px -4px inset;
  background: ${({ $color }) => $color || "rgb(51, 51, 51)"};
  color: rgb(255, 255, 255);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  min-width: 48px;
  min-height: 48px;
  padding: 0px 16px 4px;
  padding-bottom: 4px;
  position: relative;
  transition: filter 0.2s ease-in-out;

  &:hover {
    filter: brightness(0.8);
  }
`;
