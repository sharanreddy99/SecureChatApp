import React, { useState, useEffect } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import "./GroupMessages.css";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import DateFormat from "dateformat";

//Modals
import TemplateModal from "../Modals/TemplateModal";
import TimerModal from "./TimerModal";
import CreateGroupModal from "./Modals/CreateGroupModal";
import DeleteGroupModal from "./Modals/DeleteGroupModal";
import AddMembersModal from "./Modals/AddMembersModal";
import RemoveMembersModal from "./Modals/RemoveMembersModal";
import MakeAdminsModal from "./Modals/MakeAdminsModal";
import RemoveAdminsModal from "./Modals/RemoveAdminsModal";
import GroupInfoModal from "./Modals/GroupInfoModal";

const GroupMessages = () => {
  const location = useLocation();
  const history = useHistory();
  const user = location.state.user;

  //States
  const [connections, setConnections] = useState(location.state.connections);
  const [groups, setGroups] = useState(location.state.groups);
  const [activeGroup, setActiveGroup] = useState({});
  const [active, setActive] = useState(
    location.state.active !== undefined ? location.state.active : -1
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(location.state.allMessages);
  const [modal, setModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });

  const [timermodal, setTimerModal] = useState({
    isShown: false,
    message: message,
  });
  const [createGroupModal, setCreateGroupModal] = useState({
    isShown: false,
  });
  const [deleteGroupModal, setDeleteGroupModal] = useState({
    isShown: false,
  });
  const [addMembersModal, setAddMembersModal] = useState({
    isShown: false,
  });
  const [removeMembersModal, setRemoveMembersModal] = useState({
    isShown: false,
  });
  const [makeAdminsModal, setMakeAdminsModal] = useState({
    isShown: false,
  });
  const [removeAdminsModal, setRemoveAdminsModal] = useState({
    isShown: false,
  });
  const [groupInfoModal, setGroupInfoModal] = useState({
    isShown: false,
  });

  //Effects
  useEffect(() => {
    if (active != -1) {
      setActiveGroup(location.state.activeGroup);
      $("#connection" + active).addClass("GroupMessages__connections_active");
    }
  }, []);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:4201");

    socket.on("groupmessages__newgroup", (data) => {
      if (data && Object.keys(data).length > 0) {
        var isMember = data.members.some((member) => {
          return member.email === user.email;
        });

        if (isMember) {
          var groupExists = groups.some(
            (group) => group._id === data._id && group.name === data.name
          );
          var newGroups = [];
          if (groupExists) {
            newGroups = groups.map((group) => {
              if (group._id === data._id && group.name === data.name) {
                group.members = data.members;
              }
              return group;
            });
          } else {
            newGroups = [...groups, data];
          }
          history.replace({
            ...history.location,
            state: { ...location.state, groups: newGroups },
          });
          setGroups(newGroups);
        }
      }
    });

    socket.on("groupmessages__deletegroup", (data) => {
      if (data && Object.keys(data).length > 0) {
        var isMember = groups.some((group) => {
          return group._id === data._id && group.name === data.name;
        });
        if (isMember) {
          var newGroups = groups.filter((group) => {
            return !(group._id === data._id && group.name === data.name);
          });

          history.replace({
            ...history.location,
            state: {
              ...location.state,
              active: -1,
              activeGroup: {},
              groups: newGroups,
              allMessages: [],
            },
          });
          setGroups(newGroups);
          setActive(-1);
          setActiveGroup({});
          setMessages([]);
        }
      }
    });

    socket.on("groupmessages__removemembers", (data) => {
      if (data && Object.keys(data).length > 0) {
        var isPartOfRemovedGroup = groups.some((group) => {
          return (
            group._id === data._id &&
            group.name === data.name &&
            !data.members.some((member) => member.email === user.email)
          );
        });

        if (isPartOfRemovedGroup) {
          var newGroups = groups.filter((group) => {
            return !(group._id === data._id && group.name === data.name);
          });

          history.replace({
            ...history.location,
            state: {
              ...location.state,
              active: -1,
              activeGroup: {},
              groups: newGroups,
              allMessages: [],
            },
          });
          setGroups(newGroups);
          setActive(-1);
          setActiveGroup({});
          setMessages([]);
        } else {
          var newGroups = groups.map((group) => {
            if (group._id === data._id && group.name === data.name) {
              group.members = data.members;
            }
            return group;
          });

          history.replace({
            ...history.location,
            state: { ...location.state, groups: newGroups },
          });
          setGroups(newGroups);
        }
      }
    });

    socket.on("groupmessages__makeadmins", (data) => {
      if (data && Object.keys(data).length > 0) {
        var newGroups = groups.map((group) => {
          if (group._id === data._id && group.name === data.name) {
            group.admin = data.admin;
          }
          return group;
        });

        history.replace({
          ...history.location,
          state: { ...location.state, groups: newGroups },
        });
        setGroups(newGroups);
      }
    });

    socket.on("groupmessages__removeadmins", (data) => {
      if (data && Object.keys(data).length > 0) {
        var newGroups = groups.map((group) => {
          if (group._id === data._id && group.name === data.name) {
            group.admin = data.admin;
          }
          return group;
        });

        history.replace({
          ...history.location,
          state: { ...location.state, groups: newGroups },
        });
        setGroups(newGroups);
      }
    });

    socket.on("groupmessages__newmessage", (data) => {
      if (activeGroup._id == data._id && activeGroup.name == data.name) {
        setMessages([
          ...messages,
          {
            text: data.text,
            displayname: data.displayname,
            senderemail: data.senderemail,
            avatarUrl: data.avatarUrl,
            date: data.date,
            time: data.time,
          },
        ]);
      }
    });

    socket.on("groupmessages__delayedmessages", (data) => {
      if (activeGroup._id === data._id && activeGroup.name === data.name) {
        const newMessages = data.delayedMessages;
        history.replace({
          ...history.location,
          state: { ...location.state, allMessages: newMessages },
        });
        setMessages([...messages, ...newMessages]);
      }
    });

    return () => {
      socket.disconnect();
      focusLastDiv();
    };
  });

  //Handlers
  const isGroupClicked = () => {
    if (JSON.stringify(activeGroup) === JSON.stringify({})) {
      setModal({
        isShown: true.valueOf,
        ModalTitle: "Choose a group...",
        ModalBody: "Please click on a group to delete...",
      });
      setTimeout(() => {
        setModal({ ...modal, isShown: false });
      }, 1500);
      return false;
    } else {
      return true;
    }
  };

  const fetchGroupChat = async (group) => {
    const response = await axios.post("/fetchallgroupmessages", {
      groupid: group._id,
      groupname: group.name,
      email: user.email,
    });

    setMessages(response.data.allMessages);

    await axios.post("/groupmessagesseen", {
      email: user.email,
      groupid: group._id,
      groupname: group.name,
    });
  };

  const sendMessageHandler = async () => {
    if (JSON.stringify(activeGroup) === JSON.stringify({})) {
      setModal({
        isShown: true,
        ModalTitle: "Choose a Group...",
        ModalBody: "Please Choose a Group to chat with...",
      });
      return;
    }

    if (message === "") {
      setModal({
        isShown: true,
        ModalTitle: "Type a Message...",
        ModalBody: "Please type something to send...",
      });
      return;
    }

    const date = DateFormat(new Date(), "yyyy-mm-dd");
    const time = DateFormat(new Date(), "HH:MM");

    const data = {
      groupid: activeGroup._id,
      groupname: activeGroup.name,
      text: message,
      displayname: user.displayname,
      senderemail: user.email,
      avatarUrl: user.avatarUrl,
      date: date,
      time: time,
    };

    await axios.post("/sendgroupmessage", data);
    setMessage("");
  };

  const focusLastDiv = () => {
    var objDiv = document.getElementsByClassName("GroupMessages__chatarea")[0];
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  return (
    <div className="GroupMessages">
      <i
        class="fa fa-bars"
        onClick={() => {
          $(".GroupMessages__sidebar").toggle(500);
        }}
      ></i>
      <div className="GroupMessages__container">
        <div className="GroupMessages__sidebar w-100 ">
          <div className="GroupMessages__sidebar_top">
            {groups.map((group, ind) => {
              return (
                <div
                  id={"connection" + ind}
                  className={`GroupMessages__connections `}
                  onClick={() => {
                    if (active != -1) {
                      $("#connection" + active).removeClass(
                        "GroupMessages__connections_active"
                      );
                    }
                    setActive(ind);
                    setActiveGroup(group);

                    $("#connection" + ind).addClass(
                      "GroupMessages__connections_active"
                    );

                    fetchGroupChat(group);
                  }}
                  key={ind}
                >
                  <div className="row">
                    <div className="col">
                      <img src={group.pictureUrl} alt={"."} />
                      <h5>{group.name}</h5>
                    </div>
                    <div className="col-2">
                      <i
                        className="fa fa-info-circle GroupMessages__info_button"
                        onClick={() => {
                          setActive(ind);
                          setActiveGroup(group);
                          setGroupInfoModal({
                            isShown: true,
                          });
                        }}
                      ></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="GroupMessages__sidebar_bottom">
            <div className="row d-flex justify-content-around">
              <div className="col">
                <button
                  type="button"
                  className="GroupMessages__button"
                  name="creategroup"
                  onClick={(e) => {
                    setCreateGroupModal({
                      isShown: true,
                    });
                  }}
                >
                  Create Group
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="GroupMessages__button"
                  name="deletegroup"
                  onClick={(e) => {
                    if (isGroupClicked()) {
                      setDeleteGroupModal({
                        isShown: true,
                      });
                    }
                  }}
                >
                  Delete Group
                </button>
              </div>
            </div>
            <div className="row d-flex justify-content-around">
              <div className="col">
                <button
                  type="button"
                  className="GroupMessages__button"
                  name="addmembers"
                  onClick={(e) => {
                    if (isGroupClicked()) {
                      setAddMembersModal({
                        isShown: true,
                      });
                    }
                  }}
                >
                  Add Members
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="GroupMessages__button"
                  name="removemembers"
                  onClick={(e) => {
                    if (isGroupClicked()) {
                      setRemoveMembersModal({
                        isShown: true,
                      });
                    }
                  }}
                >
                  Remove Members
                </button>
              </div>
            </div>
            <div className="row d-flex justify-content-around">
              <div className="col">
                <button
                  type="button"
                  className="GroupMessages__button"
                  name="makeadmins"
                  onClick={(e) => {
                    if (isGroupClicked()) {
                      setMakeAdminsModal({
                        isShown: true,
                      });
                    }
                  }}
                >
                  Make Admins
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="GroupMessages__button"
                  name="removeadmins"
                  onClick={(e) => {
                    if (isGroupClicked()) {
                      setRemoveAdminsModal({
                        isShown: true,
                      });
                    }
                  }}
                >
                  Remove Admins
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="GroupMessages__chat w-100 ">
          <div className="GroupMessages__chatarea">
            {messages.map((message, ind) => {
              return (
                <div className="row" key={ind}>
                  <div className="col">
                    <p
                      className={`GroupMessages__message ${
                        message.senderemail == user.email
                          ? "sender"
                          : "receiver"
                      }`}
                    >
                      {message.text}
                    </p>
                    {message.senderemail == user.email ? (
                      <>
                        <p
                          className={`GroupMessages__time ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.time}
                        </p>
                        <p
                          className={`GroupMessages__date ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.date} &nbsp;&nbsp;
                        </p>
                        <p
                          className={`GroupMessages__date ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.displayname} &nbsp;&nbsp;
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          className={`GroupMessages__date ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.displayname} &nbsp;&nbsp;
                        </p>
                        <p
                          className={`GroupMessages__date ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.date} &nbsp;&nbsp;
                        </p>
                        <p
                          className={`GroupMessages__time ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.time}
                        </p>{" "}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="GroupMessages__inputarea">
            <input
              class="form-control customform"
              type="text"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  sendMessageHandler();
                }
              }}
            />
            <i class="fa fa-paper-plane" onClick={sendMessageHandler}></i>
            <i
              class="fa fa-clock-o"
              onClick={() => {
                if (JSON.stringify(activeGroup) === JSON.stringify({})) {
                  setModal({
                    isShown: true,
                    ModalTitle: "Choose a Group...",
                    ModalBody: "Please Choose a Group to chat with...",
                  });
                  return;
                }

                if (message === "") {
                  setModal({
                    isShown: true,
                    ModalTitle: "Type a Message...",
                    ModalBody: "Please type something to send...",
                  });
                  return;
                }

                setTimerModal({
                  isShown: true,
                  message: message,
                  email: user.email,
                  group: activeGroup,
                });
              }}
            ></i>
          </div>
        </div>
      </div>
      <TemplateModal
        isShown={modal.isShown}
        setIsShown={setModal}
        ModalTitle={modal.ModalTitle}
        ModalBody={modal.ModalBody}
      />
      <TimerModal
        isShown={timermodal.isShown}
        setIsShown={setTimerModal}
        message={timermodal.message}
        setMessage={setMessage}
        user={user}
        group={activeGroup}
      />
      <CreateGroupModal
        isShown={createGroupModal.isShown}
        setIsShown={setCreateGroupModal}
        user={user}
      />
      <DeleteGroupModal
        isShown={deleteGroupModal.isShown}
        setIsShown={setDeleteGroupModal}
        group={activeGroup}
        user={user}
      />
      <AddMembersModal
        isShown={addMembersModal.isShown}
        setIsShown={setAddMembersModal}
        group={activeGroup}
        user={user}
        connections={connections}
      />
      <RemoveMembersModal
        isShown={removeMembersModal.isShown}
        setIsShown={setRemoveMembersModal}
        group={activeGroup}
        user={user}
        connections={connections}
      />
      <MakeAdminsModal
        isShown={makeAdminsModal.isShown}
        setIsShown={setMakeAdminsModal}
        group={activeGroup}
        user={user}
        connections={connections}
      />
      <RemoveAdminsModal
        isShown={removeAdminsModal.isShown}
        setIsShown={setRemoveAdminsModal}
        group={activeGroup}
        user={user}
        connections={connections}
      />

      <GroupInfoModal
        isShown={groupInfoModal.isShown}
        setIsShown={setGroupInfoModal}
        group={activeGroup}
      />
    </div>
  );
};

export default GroupMessages;
