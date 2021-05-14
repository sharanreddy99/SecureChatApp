import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const GroupInfoModal = ({
  isShown,
  setIsShown,
  group,
  email,
  groups,
  setGroups,
  setActiveGroup,
  setActive,
  setMessages,
}) => {
  //States
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [admins, setAdmins] = useState([]);

  //Handlers
  const chooseRoleHandler = (option) => {
    if (option === "admins") {
      if (JSON.stringify(group) !== JSON.stringify({})) {
        var completeAdmins = group.members.filter((member) => {
          return group.admin.some((row) => row.email === member.email);
        });
        setAdmins(completeAdmins);
      }
      setShowAdmin(true);
      setShowMembers(false);
    } else if (option === "members") {
      setShowAdmin(false);
      setShowMembers(true);
    } else {
      setShowAdmin(false);
      setShowMembers(false);
    }
  };

  const exitGroupHandler = async () => {
    try {
      if (window.confirm("Are you sure?")) {
        await axios.post("/exitgroup", {
          groupid: group._id,
          groupname: group.name,
          email: email,
        });

        var newGroups = groups.filter(
          (row) => !(row._id == group._id && row.name == group.name)
        );
        setGroups(newGroups);
        setActiveGroup({});
        setMessages([]);
        setActive(-1);
        handleClose();
      }
    } catch (e) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsShown({
      ...isShown,
      isShown: false,
    });
    setShowAdmin(false);
    setShowMembers(false);
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
          <Modal.Title>{group.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <div className="row">
            <div className="col">
              <img src={group.pictureUrl} className="GroupInfoModal__picture" />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <div className="input-group">
                <div
                  className="input-group-prepend"
                  style={{
                    borderRight: "1px solid var(--logoTextColor)",
                  }}
                >
                  <span
                    className="input-group-text"
                    style={{
                      backgroundColor: "var(--modalHeaderBackground)",
                      color: "var(--modalHeaderText)",
                    }}
                  >
                    Owner
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control GroupMessages__info_owner"
                  value={group.owner}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <select
                class="form-control GroupMessages__info_select"
                style={{
                  backgroundColor: "var(--modalHeaderBackground)",
                  color: "var(--modalHeaderText)",
                }}
                onChange={(e) => {
                  chooseRoleHandler(e.target.value);
                }}
              >
                <option value="default" selected>
                  Choose a role to view members
                </option>
                <option value="admins">Admins</option>
                <option value="members">Members</option>
              </select>
            </div>
          </div>

          {showAdmin ? (
            <div className="row mt-4 GroupInfoModal__container">
              <div className="col">
                {admins.map((admin) => {
                  return (
                    <div className="container">
                      <div className="row mt-2">
                        <div className="col-3">
                          <img src={admin.avatarUrl} />
                        </div>
                        <div className="col-9">
                          <div className="row">
                            <div className="col">
                              <h4>{admin.displayname}</h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <h6>{admin.email}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {showMembers ? (
            <div className="row mt-4 GroupInfoModal__container">
              <div className="col">
                {group.members.map((member) => {
                  return (
                    <div className="container">
                      <div className="row mt-2">
                        <div className="col-3">
                          <img src={member.avatarUrl} />
                        </div>
                        <div className="col-9">
                          <div className="row">
                            <div className="col">
                              <h4>{member.displayname}</h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <h6>{member.email}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--modalButtonBackground)",
              color: "var(--modalButtonText)",
              fontWeight: "bold",
            }}
            onClick={exitGroupHandler}
          >
            Exit Group
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
    </>
  );
};
export default GroupInfoModal;
