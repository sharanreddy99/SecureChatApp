import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import TemplateModal from "../../Modals/TemplateModal";

const CreateGroupModal = ({ isShown, setIsShown, user }) => {
  const [groupName, setGroupName] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [resultModal, setResultModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });

  const createGroupHandler = async () => {
    if (groupName === "") {
      setResultModal({
        isShown: true,
        ModalTitle: "Group Name Empty!!!",
        ModalBody: "Please enter a valid Group Name",
      });

      setTimeout(() => {
        setResultModal({
          ...resultModal,
          isShown: false,
        });
      }, 2000);
    }

    const response = await axios.post("/creategroup", {
      groupname: groupName,
      imageurl: imageURL,
      user: user,
    });

    setResultModal({
      ...resultModal,
      isShown: true,
      ModalTitle: "Success!!",
      ModalBody: "New Group created successfully",
    });

    setTimeout(() => {
      setResultModal({
        ...resultModal,
        isShown: false,
      });

      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setIsShown({
      ...isShown,
      isShown: false,
    });

    setGroupName("");
    setImageURL("");
  };

  return (
    <>
      <Modal
        show={isShown}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "var(--modalHeaderBackground)",
            color: "var(--modalHeaderText)",
            textShadow: "2px 2px var(--modalTextShadow)",
          }}
        >
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Group Name
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
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Group Picture URL{" "}
          </h5>
          <input
            style={{
              backgroundColor: "var(--modalHeaderBackground)",
              color: "var(--modalHeaderText)",
            }}
            class="form-control"
            type="url"
            name="imageurl"
            onChange={(e) => {
              setImageURL(e.target.value);
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
            onClick={createGroupHandler}
          >
            Create Group
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
export default CreateGroupModal;
