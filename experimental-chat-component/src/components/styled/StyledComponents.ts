import styled from "styled-components";

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
`;

export const MessagesList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
`;

export const MessageTimestamp = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 5px;
`;

export const Message = styled.div<{ isUser: boolean }>`
  background-color: ${(props) => (props.isUser ? "#dcf8c6" : "#f1f1f1")};
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  max-width: 60%;
`;

export const MessageText = styled.p`
  margin: 0;
`;

export const UserName = styled.span`
  font-weight: bold;
`;

export const InputContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

export const MessageInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
//
//
//
export const CustomMessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  margin: 10px 0;
`;

export const CustomMessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 60%;
  padding: 12px;
  border-radius: 20px;
  background-color: ${(props) => (props.isUser ? "green" : "blue")};
  border: 1px solid sandybrown;
  color: ${(props) => (props.isUser ? "white" : "white")};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

export const CustomMessageText = styled.p`
  margin: 0;
  word-wrap: break-word;
`;

export const CustomUserName = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
`;

export const CustomMessageTimestamp = styled.span`
  font-size: 0.75rem;
  color: white;
  align-self: flex-end;
`;
