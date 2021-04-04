import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const DeleteMessageModal = ({
  isShown,
  setIsShown,
  message,
  messages,
  setMessages,
}) => {
  const location = useLocation();
  const history = useHistory();

  const deleteMessageHandler = async () => {
    await axios.post("/deleteemail", { message: message });
    const updatedMessages = messages.filter((row) => row._id !== message._id);
    history.replace({
      ...history.location,
      state: { ...location.state, allMessages: updatedMessages },
    });
    setMessages(updatedMessages);
    handleClose();
  };

  const handleClose = () => {
    setIsShown({
      isShown: false,
    });
  };

  return (
    <>
      <Modal show={isShown} onHide={handleClose} backdrop="static">
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#5d001e",
            color: "white",
            textShadow: "2px 2px black",
          }}
        >
          <Modal.Title>Delete the Message</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px #5d001e" }}>
            Are you sure you want to delete the message?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "#5d001e",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={deleteMessageHandler}
          >
            Yes
          </Button>
          <Button
            style={{
              backgroundColor: "#5d001e",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={handleClose}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteMessageModal;
