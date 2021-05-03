import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import axios from "axios";
import TemplateModal from "../../Modals/TemplateModal";

const CreateGroupModal = ({
  isShown,
  setIsShown,
  email,
  allEmails,
  setConnections,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [resultModal, setResultModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });
  const [groupName, setGroupName] = useState("");
  const [groupEmails, setGroupEmails] = useState([]);

  //Styles
  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "var(--templateColor1)",
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      borderColor: state.isFocused
        ? "var(--templateColor2)"
        : "var(--templateColor1)",
      boxShadow: state.isFocused ? null : null,
      "&:hover": { backgroundColor: "var(--templateColor3)" },
    }),
    option: (base) => ({
      ...base,
      backgroundColor: "var(--templateColor2)",
      color: "var(--logoTextColor)",
      "&:hover": {
        backgroundColor: "var(--templateColor3)",
        color: "var(--logoBgColor)",
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      background: "var(--templateColor2)",
      color: "var(--logoTextColor)",
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
      fontWeight: "bold",
    }),
    multiValue: (base) => ({
      ...base,
      background: "var(--templateColor2)",
      color: "var(--logoTextColor)",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
    }),
    input: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
    }),
  };

  //Handlers
  const createGroupHandler = async () => {
    try {
      const response = await axios.post("/createemailgroup", {
        name: groupName,
        owner: email,
        receiveremails: groupEmails.map((email) => email.value),
      });

      setResultModal({
        isShown: true,
        ModalTitle: " Group Created...",
        ModalBody:
          "Created a group with " +
          groupEmails.length +
          " members successfully...",
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
        ModalTitle: "Group Exists ⚠",
        ModalBody: "Cannot create another group with the same name.",
      });

      setTimeout(() => {
        setResultModal({
          isShown: false,
        });

        handleClose();
      }, 2500);
    }
  };

  const handleClose = async () => {
    var response1 = await axios.post("/fetchconnections", {
      email: email,
    });

    const response2 = await axios.post("/getemailgroups", {
      owner: email,
    });

    const allgroups = response2.data.allgroups.map((group) => ({
      email: group.name,
      isGroup: true,
    }));

    history.replace({
      ...history.location,
      state: {
        ...location.state,
        connections: [...response1.data.connections, ...allgroups],
      },
    });
    setConnections([...response1.data.connections, ...allgroups]);

    setGroupEmails([]);
    setGroupName("");
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
            backgroundColor: "var(--modalHeaderBackground)",
            color: "var(--modalHeaderText)",
            textShadow: "2px 2px var(--modalTextShadow)",
          }}
        >
          <Modal.Title>
            <b>Create Email Group</b>
          </Modal.Title>
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
          <Select
            maxMenuHeight="35vh"
            styles={customStyles}
            isMulti={true}
            isSearchable={true}
            placeholder="To: "
            noOptionsMessage={() => "No Recipients."}
            onChange={(e) => {
              setGroupEmails(e);
            }}
            value={groupEmails}
            options={allEmails}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
              fontWeight: "bold",
            }}
            disabled={groupEmails.length === 0 || groupName === ""}
            onClick={createGroupHandler}
          >
            Create Email Group
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
