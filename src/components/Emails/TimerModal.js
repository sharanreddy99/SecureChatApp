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
  subject,
  setSubject,
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

  const sendDelayedEmailHandler = async () => {
    const response = await axios.post("/delayemail", {
      text: message,
      senderemail: email,
      receiveremail: connectionemail,
      subject: subject,
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
      setSubject("");
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
      subject: subject,
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
            backgroundColor: "#5d001e",
            color: "white",
            textShadow: "2px 2px black",
          }}
        >
          <Modal.Title>Delayed Email</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px #5d001e" }}>Choose Date</h5>
          <input
            type="date"
            name="date"
            style={{ backgroundColor: "#5d001e", color: "white" }}
            class="form-control mb-4"
            value={date}
            min={todaydate}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <h5 style={{ textShadow: "1px 1px #5d001e" }}>Choose Time</h5>
          <input
            style={{ backgroundColor: "#5d001e", color: "white" }}
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
              backgroundColor: "#5d001e",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={sendDelayedEmailHandler}
          >
            Send Delayed Email
          </Button>
          <Button
            style={{
              backgroundColor: "#5d001e",
              color: "white",
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
