import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import TemplateModal from "../../Modals/TemplateModal";

const DeleteGroupModal = ({ isShown, setIsShown, user, group }) => {
  const [groupName, setGroupName] = useState("");

  const [resultModal, setResultModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });

  const deleteGroupHandler = async () => {
    try {
      const response = await axios.post("/deletegroup", {
        groupid: group._id,
        groupname: groupName,
        email: user.email,
      });

      setResultModal({
        isShown: true,
        ModalTitle: "Group Deleted...",
        ModalBody: "You have successfully deleted the group...",
      });

      setTimeout(() => {
        setResultModal({
          isShown: false,
        });

        handleClose();
      }, 2500);
    } catch (e) {
      setResultModal({
        isShown: true,
        ModalTitle: "Not Authorized ⚠",
        ModalBody:
          "You don't have sufficient permissions to delete the group...",
      });

      setTimeout(() => {
        setResultModal({
          isShown: false,
        });

        handleClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setIsShown({
      ...isShown,
      isShown: false,
    });

    setGroupName("");
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
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Please type the following text <br />
            <b style={{ color: "red" }}>{group.name}</b>
            <br /> to confirm deletion...
          </h5>
          <input
            type="text"
            name="groupname"
            style={{
              backgroundColor: "var(--modalHeaderBackground)",
              color: "var(--modalHeaderText)",
            }}
            class="form-control mb-4"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
              fontWeight: "bold",
            }}
            disabled={group.name !== groupName}
            onClick={deleteGroupHandler}
          >
            Delete Group
          </Button>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
              fontWeight: "bold",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <TemplateModal
        isShown={resultModal.isShown}
        setIsShown={setResultModal}
        ModalTitle={resultModal.ModalTitle}
        ModalBody={resultModal.ModalBody}
      />
    </>
  );
};
export default DeleteGroupModal;
