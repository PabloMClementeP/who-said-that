import styled from "styled-components";

export const QuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: calc(100vh - 100px);
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
`;

export const QuestionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;
export const QuestionCard = styled.div`
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  width: 300px;
`;

export const QuestionText = styled.p`
  margin-bottom: 10px;
  font-size: 1.1em;
  color: #333;
  text-align: center;
  padding: 8px;
  height: 72px;
`;

export const AnswerTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
  resize: none;
`;
