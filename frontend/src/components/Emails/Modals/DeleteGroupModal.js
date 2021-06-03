import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import axios from "axios";
import TemplateModal from "../../Modals/TemplateModal";
import $ from "jquery";

const DeleteGroupModal = ({
  isShown,
  setIsShown,
  email,
  allgroups,
  setConnections,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [resultModal, setResultModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });
  const [groupNames, setGroupNames] = useState([]);

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
  const deleteGroupHandler = async () => {
    try {
      const response = await axios.post("/deleteemailgroups", {
        emailgroups: groupNames.map((group) => group.value),
        owner: email,
      });

      setResultModal({
        isShown: true,
        ModalTitle: " Groups Deleted...",
        ModalBody: "Deleted " + groupNames.length + " Groups successfully...",
      });

      setTimeout(() => {
        setResultModal({
          isShown: false,
        });

        handleClose(true);
      }, 1500);
    } catch (e) {
      setResultModal({
        isShown: true,
        ModalTitle: "Not Authorized ⚠",
        ModalBody: "You are not the owner of the group.",
      });

      setTimeout(() => {
        setResultModal({
          isShown: false,
        });

        handleClose(false);
      }, 2500);
    }
  };

  const handleClose = (flag) => {
    if(flag) {
      const temp = location.state.connections;
      history.replace({
        ...history.location,
        state: {
          ...location.state,
          connections: temp.filter((connection) => {
            return !groupNames.some((group) => {
              return group.value === connection.email;
            });
          }),
        },
      });
      setConnections(
        temp.filter((connection) => {
          return !groupNames.some((group) => {
            return group.value === connection.email;
          });
        })
      );
    }
    setGroupNames([]);
    setIsShown({
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
            <b>Delete Email Groups</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <Select
            styles={customStyles}
            isMulti={true}
            isSearchable={true}
            placeholder="To: "
            noOptionsMessage={() => "No Groups."}
            onChange={(e) => {
              setGroupNames(e);
            }}
            value={groupNames}
            options={allgroups}
          />
          {groupNames.map((group) => (
            <div>
              <b>{group.name + ":"}</b>
              <br />
              {group.recipients.map((email) => {
                return (
                  <div>
                    <b>{email}</b>
                    <br />
                  </div>
                );
              })}
              <hr />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
              fontWeight: "bold",
            }}
            disabled={groupNames.length === 0}
            onClick={deleteGroupHandler}
          >
            Delete
          </Button>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
              fontWeight: "bold",
            }}
            onClick={()=>handleClose(false)}
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
