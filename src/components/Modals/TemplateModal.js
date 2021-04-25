import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const TemplateModal = ({ isShown, setIsShown, ModalTitle, ModalBody }) => {
  const handleClose = () => {
    setIsShown({ isShown: false, ModalTitle, ModalBody });
  };

  return (
    <Modal
      show={isShown}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "var(--templateColor1)",
          color: "var(--logoTextColor)",
          textShadow: "2px 2px var(--logoBgColor)",
        }}
      >
        <Modal.Title>{ModalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontWeight: "bold" }}>{ModalBody}</Modal.Body>
      <Modal.Footer>
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
  );
};
export default TemplateModal;
