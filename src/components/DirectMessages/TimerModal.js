import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DateFormat from "dateformat";
import axios from "axios";
import TemplateModal from "../Modals/TemplateModal";

const TimerModal = ({
  isShown,
  setIsShown,
  message,
  setMessage,
  email,
  connectionemail,
}) => {
  const todaydate = DateFormat(new Date(), "yyyy-mm-dd");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [resultModal, setResultModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });

  const sendDelayedMessageHandler = async () => {
    const response = await axios.post("/delaydirectmessage", {
      text: message,
      senderemail: email,
      receiveremail: connectionemail,
      date: date,
      time: time,
    });

    setResultModal({
      ...resultModal,
      isShown: true,
      ModalTitle: response.data.ModalTitle,
      ModalBody: response.data.ModalBody,
    });

    if (response.data.status === "success") {
      setMessage("");
    }

    setTimeout(() => {
      setResultModal({
        ...resultModal,
        isShown: false,
      });

      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsShown({
      isShown: false,
      message: "",
      email: email,
      connectionemail: connectionemail,
    });

    setDate("");
    setTime("");
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
          <Modal.Title>Delayed Message</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Choose Date
          </h5>
          <input
            type="date"
            name="date"
            style={{
              backgroundColor: "var(--modalHeaderBackground)",
              color: "var(--modalHeaderText)",
            }}
            class="form-control mb-4"
            value={date}
            min={todaydate}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <h5 style={{ textShadow: "1px 1px var(--modalTextShadow)" }}>
            Choose Time
          </h5>
          <input
            style={{
              backgroundColor: "var(--modalHeaderBackground)",
              color: "var(--modalHeaderText)",
            }}
            class="form-control"
            type="time"
            name="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
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
            onClick={sendDelayedMessageHandler}
          >
            Send Delayed Message
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
export default TimerModal;
