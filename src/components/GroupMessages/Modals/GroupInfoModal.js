import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const GroupInfoModal = ({ isShown, setIsShown, group }) => {
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
            backgroundColor: "#5d001e",
            color: "white",
            textShadow: "2px 2px black",
          }}
        >
          <Modal.Title>{group.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bold" }}>
          <div className="row">
            <div className="col">
              <img
                src={group.pictureUrl}
                style={{
                  width: "30vh",
                  height: "30vh",
                  borderRadius: "100%",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            </div>
          </div>
          <div className="row m-4">
            <div className="col">
              <div className="input-group">
                <div
                  className="input-group-prepend"
                  style={{
                    borderRight: "1px solid white",
                  }}
                >
                  <span
                    className="input-group-text"
                    style={{
                      backgroundColor: "#5d001e",
                      color: "white",
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
          <div className="row m-4">
            <div className="col">
              <select
                class="form-control GroupMessages__info_select"
                style={{ backgroundColor: "#5d001e", color: "white" }}
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
    </>
  );
};
export default GroupInfoModal;
