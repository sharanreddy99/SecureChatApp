import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DateFormat from "dateformat";
import axios from "axios";
import TemplateModal from "../Modals/TemplateModal";

const TimerModal = ({
  isShown,
  setIsShown,
  email,
  toEmails,
  setToEmails,
  subject,
  setSubject,
  newMailBody,
  setNewMailBody,
  newMailAttachments,
  setNewMailAttachments,
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
    const formData = new FormData();
    for (let i = 0; i < newMailAttachments.length; i++) {
      formData.append("customfiles", newMailAttachments[i]);
    }

    formData.append("text", newMailBody);
    formData.append("email", email);
    formData.append(
      "toemails",
      JSON.stringify(toEmails.map((email) => email.value))
    );
    formData.append("subject", subject);
    formData.append("date", date);
    formData.append("time", time);

    const response = await axios.post("/delaymail", formData);

    setResultModal({
      ...resultModal,
      isShown: true,
      ModalTitle: response.data.ModalTitle,
      ModalBody: response.data.ModalBody,
    });

    if (response.data.status === "success") {
      setToEmails([]);
      setSubject([]);
      setNewMailBody([]);
      setNewMailAttachments([]);
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
            backgroundColor: "var(--templateColor1)",
            color: "var(--logoTextColor)",
            textShadow: "2px 2px var(--logoBgColor)",
          }}
        >
          <Modal.Title>Delayed Email</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <h5 style={{ textShadow: "1px 1px var(--templateColor1)" }}>
            Choose Date
          </h5>
          <input
            type="date"
            name="date"
            style={{
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
            }}
            class="form-control mb-4"
            value={date}
            min={todaydate}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <h5 style={{ textShadow: "1px 1px var(--templateColor1)" }}>
            Choose Time
          </h5>
          <input
            style={{
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
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
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
              fontWeight: "bold",
            }}
            onClick={sendDelayedEmailHandler}
          >
            Send Delayed Email
          </Button>
          <Button
            style={{
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
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
