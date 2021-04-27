import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DateFormat from "dateformat";
import axios from "axios";
import TemplateModal from "../Modals/TemplateModal";

const UpdateMessageModal = ({
  isShown,
  setIsShown,
  message,
  editbutton,
  deletebutton,
  connectionemail,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [newMessage, setNewMessage] = useState("");

  const updateMessageHandler = async () => {
    if (newMessage === "") {
      return;
    }

    await axios.post("/updatedirectmessage", {
      message: message,
      newmessage: newMessage,
      connectionemail: connectionemail,
    });
    setNewMessage("");
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
            backgroundColor: "var(--templateColor1)",
            color: "var(--logoTextColor)",
            textShadow: "2px 2px var(--logoBgColor)",
          }}
        >
          <Modal.Title>Update the Message</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h4>Old Message: </h4>
          <b className="DirectMessages__oldmessage" style={{ padding: "2%" }}>
            {typeof message === "object" ? message.text : ""}
          </b>
          <hr />
          <input
            type="text"
            style={{
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
            }}
            class="form-control"
            placeholder="Enter New Message."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateMessageHandler();
              }
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
              fontWeight: "bold",
            }}
            onClick={updateMessageHandler}
          >
            Update
          </Button>
          <Button
            style={{
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
              fontWeight: "bold",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdateMessageModal;
