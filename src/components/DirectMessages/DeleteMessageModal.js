import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DateFormat from "dateformat";
import axios from "axios";
import TemplateModal from "../Modals/TemplateModal";

const DeleteMessageModal = ({
  isShown,
  setIsShown,
  message,
  messages,
  setMessages,
  editbutton,
  deletebutton,
}) => {
  const location = useLocation();
  const history = useHistory();

  const deleteMessageHandler = async () => {
    await axios.post("/deletedirectmessage", { message: message });
    const updatedMessages = messages.filter((row) => row._id !== message._id);
    history.replace({
      ...history.location,
      state: { ...location.state, allMessages: updatedMessages },
    });
    setMessages(updatedMessages);
    handleClose();
  };

  const removeHoverClass = () => {
    if (typeof editbutton === "object" && typeof deletebutton === "object") {
      editbutton.classList.remove("DirectMessages__message_hover");
      editbutton.classList.add("DirectMessages__message_non_hover");
      deletebutton.classList.remove("DirectMessages__message_hover");
      deletebutton.classList.add("DirectMessages__message_non_hover");
    }
  };

  const handleClose = () => {
    removeHoverClass();
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
            backgroundColor: "var(--modalHeaderBackground)",
            color: "var(--modalHeaderText)",
            textShadow: "2px 2px var(--modalTextShadow)",
          }}
        >
          <Modal.Title>Delete the Message</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Are you sure you want to delete the message?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
              fontWeight: "bold",
            }}
            onClick={deleteMessageHandler}
          >
            Yes
          </Button>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
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
