import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ViewPollModal = ({ isShown, setIsShown, responses }) => {
  const handleClose = () => {
    setIsShown({
      isShown: false,
      responses: [],
    });
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
          <Modal.Title>Poll Result...</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Yes</th>
                <th scope="col">No</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => {
                return (
                  <tr>
                    <td scope="row">{response[0]}</td>
                    <td scope="row">{response[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
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
    </>
  );
};
export default ViewPollModal;
