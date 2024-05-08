import styled from "styled-components";

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  /* border: 10px solid yellow; */
`;

export const MessagesList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background-color: #e8edf2;
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
  margin-top: 24px;
  border-radius: 15px 15px 0px 0px;
  box-shadow: 1px -1px 10px 0 rgba(0, 0, 0, 0.25);
  padding: 30px 11px;
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
  flex-direction: ${(props) => (!props.isUser ? "row" : "row-reverse")};
  align-items: end;
  margin: 10px 0;
  gap: 5px;
`;

export const CustomMessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 60%;
  padding: 12px 8px;
  border-radius: ${(props) =>
    props.isUser ? "15px 15px 0px 15px" : "15px 15px 15px 0px"};
  background-color: #ffffff;
  color: #000000;
  text-align: left;
`;

export const CustomMessageText = styled.p`
  margin: 0;
  word-wrap: break-word;
`;

export const CustomUserName = styled.span<{ isUser: boolean }>`
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => (props.isUser ? "#12B829" : "#0052cd")};
`;

export const CustomMessageTimestamp = styled.span`
  font-size: 0.75rem;
  align-self: flex-end;
  color: #8f8f8f;
`;

export const CustomMessagePhoto = styled.img`
  width: 45px;
  aspect-ratio: 1/1;
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 100px;
`;

export const CustomMessagePhotoContainer = styled.div``;

export const CustomSystemMessage = styled.div`
  width: 100%;
  text-align: center;
`;

export const CustomSystemMessageText = styled.p`
  margin: 0;
  word-wrap: break-word;
  color: #000000;
`;
