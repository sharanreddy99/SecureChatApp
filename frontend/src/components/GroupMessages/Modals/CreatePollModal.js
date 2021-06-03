import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import TemplateModal from "../../Modals/TemplateModal";
import dateFormat from "dateformat";

const CreatePollModal = ({ isShown, setIsShown, group, user }) => {
  const [pollName, setPollName] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [resultModal, setResultModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });

  const createPollHandler = async () => {
    var flag = false;
    var date = "";
    var time = "";
    if (pollName === "") {
      setResultModal({
        isShown: true,
        ModalTitle: "Empty Fields",
        ModalBody: "Please enter a valid Poll Name",
      });
      flag = true;
    } else if (pollDescription === "") {
      setResultModal({
        isShown: true,
        ModalTitle: "Empty Fields",
        ModalBody: "Please enter a valid Poll Description",
      });
      flag = true;
    } else {
      [date, time] = expiryDate.split("T");
      var curdate = dateFormat("yyyy-mm-dd");
      var curtime = dateFormat("hh:MM");
      if (date < curdate || (date === curdate && time <= curtime)) {
        flag = true;
        setResultModal({
          isShown: true,
          ModalTitle: "Invalid Expiry Date",
          ModalBody: "Please choose a future date and time...",
        });
      }
    }
    if (flag) {
      setTimeout(() => {
        setResultModal({
          ...resultModal,
          isShown: false,
        });
      }, 2000);
    } else {
      await axios.post("/createpoll", {
        groupid: group._id,
        groupname: group.name,
        pollname: pollName,
        polldescription: pollDescription,
        expirydate: date,
        expirytime: time,
        email: user.email,
        displayname: user.displayname,
        avatarUrl: user.avatarUrl,
      });
      setResultModal({
        isShown: true,
        ModalTitle: "Poll Created!!",
        ModalBody: "New Poll has been created successfully",
      });
      setTimeout(() => {
        setResultModal({
          ...resultModal,
          isShown: false,
        });
        handleClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setIsShown({
      isShown: false,
    });

    setPollName("");
    setPollDescription("");
    setExpiryDate("");
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
          <Modal.Title>Create Poll</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Poll Name
          </h5>
          <input
            type="text"
            name="pollname"
            style={{
              backgroundColor: "var(--modalHeaderBackground)",
              color: "var(--modalHeaderText)",
            }}
            placeholder="Enter Poll Name..."
            class="form-control mb-4"
            onChange={(e) => {
              setPollName(e.target.value);
            }}
          />
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Poll Description
          </h5>
          <textarea
            style={{
              backgroundColor: "var(--modalHeaderBackground)",
              color: "var(--modalHeaderText)",
            }}
            class="form-control"
            name="polldescription"
            placeholder="Enter Poll Description..."
            onChange={(e) => {
              setPollDescription(e.target.value);
            }}
          />
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Poll Deadline
          </h5>
          <input
            style={{
              backgroundColor: "var(--modalHeaderBackground)",
              color: "var(--modalHeaderText)",
            }}
            class="form-control"
            type="datetime-local"
            name="polldescription"
            onChange={(e) => {
              setExpiryDate(e.target.value);
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
            onClick={createPollHandler}
          >
            Create Poll
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
export default CreatePollModal;
