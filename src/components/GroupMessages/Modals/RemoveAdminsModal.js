import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import axios from "axios";
import TemplateModal from "../../Modals/TemplateModal";

const RemoveAdminsModal = ({
  isShown,
  setIsShown,
  user,
  group,
  connections,
}) => {
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [resultModal, setResultModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });

  //Effects
  useEffect(() => {
    setAllMembers(
      connections.map((connection) => {
        return {
          ...connection,
          value: connection.email,
          label: connection.displayname + " | " + connection.email,
        };
      })
    );
  }, []);

  //Handlers
  /**
   * @param {Object} provided -- the component's default styles
   * @param {Object} state -- the component's current state e.g. `isFocused`
   * @returns {Object}
   */
  function styleFn(provided, state) {
    var backgroundColor = state.isFocused
      ? "var(--templateColor1)"
      : "var(--logoTextColor)";
    var color = state.isFocused
      ? "var(--logoTextColor)"
      : "var(--templateColor1)";
    return { ...provided, backgroundColor, color };
  }

  const removeAdminsHandler = async () => {
    try {
      const response = await axios.post("/removeadmins", {
        groupid: group._id,
        groupname: group.name,
        email: user.email,
        admins: selectedMembers.map((member) => {
          return {
            email: member.email,
          };
        }),
      });

      setResultModal({
        isShown: true,
        ModalTitle: "Updated Role...",
        ModalBody: "Updated the role of the specified members successfully...",
      });

      setTimeout(() => {
        setResultModal({
          isShown: false,
        });

        handleClose();
      }, 1500);
    } catch (e) {
      setResultModal({
        isShown: true,
        ModalTitle: "Not Authorized ⚠",
        ModalBody:
          "You don't have sufficient permissions to update the roles of the specified members...Please make sure you are not updating the role of the creator of the group...",
      });

      setTimeout(() => {
        setResultModal({
          isShown: false,
        });

        handleClose();
      }, 2500);
    }
  };

  const handleClose = () => {
    setIsShown({
      ...isShown,
      isShown: false,
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
            backgroundColor: "var(--templateColor1)",
            color: "var(--logoTextColor)",
            textShadow: "2px 2px var(--logoBgColor)",
          }}
        >
          <Modal.Title>
            Convert Admins to Members in <b>{group.name}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <Select
            styles={{ option: styleFn }}
            isMulti={true}
            isSearchable={true}
            placeholder="Choose the members..."
            onChange={(e) => {
              setSelectedMembers(e);
            }}
            options={allMembers}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--templateColor1)",
              color: "var(--logoTextColor)",
              fontWeight: "bold",
            }}
            disabled={selectedMembers.length === 0}
            onClick={removeAdminsHandler}
          >
            Remove Admins
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
export default RemoveAdminsModal;
