import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./GroupMessages.css";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import DateFormat from "dateformat";
import EmojiPickerModal from "../Modals/EmojiPickerModal";

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
import DeleteMessageModal from "./DeleteMessageModal";
import UpdateMessageModal from "./UpdateMessageModal";
import CreatePollModal from "./Modals/CreatePollModal";
import ViewPollModal from "./Modals/ViewPollModal";

const GroupMessages = () => {
  const location = useLocation();
  const history = useHistory();
  const user = location.state.user;
  var editbutton = undefined;
  var deletebutton = undefined;

  //States
  const [connections, setConnections] = useState(location.state.connections);
  const [groups, setGroups] = useState(location.state.groups);
  const [activeGroup, setActiveGroup] = useState({});
  const [active, setActive] = useState(
    location.state.active !== undefined ? location.state.active : -1
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(location.state.allMessages);
  const [emojiText, setEmojiText] = useState("");
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
  const [deleteMessageModal, setDeleteMessageModal] = useState({
    isShown: false,
    message: "",
  });
  const [updateMessageModal, setUpdateMessageModal] = useState({
    isShown: false,
    message: "",
  });
  const [emojiPickerModal, setEmojiPickerModal] = useState({
    isShown: false,
  });
  const [createPollModal, setCreatePollModal] = useState({
    isShown: false,
  });
  const [viewPollModal, setViewPollModal] = useState({
    isShown: false,
    responses: [],
  });

  //Effects
  useEffect(() => {
    if (active != -1) {
      setActiveGroup(location.state.activeGroup);
      $("#connection" + active).addClass("GroupMessages__connections_active");
      focusLastDiv();
    }
  }, []);

  useEffect(() => {
    const socket = io({ path: "/web_socket_server" });

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

    socket.on("groupmessages__deletemessage", (data) => {
      const newMessages = messages.filter((row) => row._id !== data._id);
      history.replace({
        ...history.location,
        state: { ...location.state, allMessages: newMessages },
      });
      setMessages(newMessages);
    });

    socket.on("groupmessages__updatemessage", (data) => {
      const newMessages = messages.map((row) => {
        if (row._id === data.message._id) {
          row.text = data.message.text;
        }
        return row;
      });
      history.replace({
        ...history.location,
        state: { ...location.state, allMessages: newMessages },
      });
      setMessages(newMessages);
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
            _id: data.messageid,
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

    socket.on("groupmessages__newpoll", (data) => {
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
            _id: data.messageid,
          },
        ]);
      }
    });

    return () => {
      socket.disconnect();
      focusLastDiv();
    };
  });

  //Handlers
  const addHoverClass = () => {
    if (typeof editbutton === "object" && typeof deletebutton === "object") {
      editbutton.classList.add("GroupMessages__message_hover");
      editbutton.classList.remove("GroupMessages__message_non_hover");
      deletebutton.classList.add("GroupMessages__message_hover");
      deletebutton.classList.remove("GroupMessages__message_non_hover");
    }
  };

  const removeHoverClass = () => {
    if (typeof editbutton === "object" && typeof deletebutton === "object") {
      editbutton.classList.remove("GroupMessages__message_hover");
      editbutton.classList.add("GroupMessages__message_non_hover");
      deletebutton.classList.remove("GroupMessages__message_hover");
      deletebutton.classList.add("GroupMessages__message_non_hover");
    }
  };

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
              let temparr = message.text.split("==|--");
              if (temparr.length == 3 && temparr[0] == "thispoll") {
                return (
                  <div className="row" key={ind}>
                    <div className="col">
                      <p className={`GroupMessages__poll`}>
                        <img src={message.avatarUrl} />
                        <p className="email">{message.senderemail}</p>
                        <h5 className="title">{temparr[1]}</h5>
                        <p className="description">
                          <b>{temparr[2]}</b>
                        </p>
                        <button
                          type="button"
                          className="form-control"
                          onClick={async () => {
                            await axios.post("/updatepoll", {
                              pollid: message._id,
                              email: user.email,
                              pollresponse: "yes",
                            });
                          }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="form-control mt-2"
                          onClick={async () => {
                            await axios.post("/updatepoll", {
                              pollid: message._id,
                              email: user.email,
                              pollresponse: "no",
                            });
                          }}
                        >
                          No
                        </button>
                        <p className="date">
                          Deadline:{"  "}
                          {message.date + " " + message.time}
                        </p>
                        <i
                          class="fa fa-trash GroupMessages__delete_button"
                          onClick={() => {
                            setDeleteMessageModal({
                              isShown: true,
                              message: message,
                              editbutton: editbutton,
                              deletebutton: deletebutton,
                            });
                          }}
                        ></i>
                        <i
                          className="fa fa-info-circle GroupMessages__info_button"
                          onClick={async () => {
                            const response = await axios.post(
                              "/fetchpollresult",
                              { pollid: message._id }
                            );
                            let responses = [];
                            let n1 = response.data.responses.yes.length;
                            let n2 = response.data.responses.no.length;
                            let n = n1 > n2 ? n1 : n2;
                            for (let i = 0; i < n; i++) {
                              responses.push(["-", "-"]);
                            }
                            for (let i = 0; i < n1; i++) {
                              responses[i][0] = response.data.responses.yes[i];
                            }
                            for (let i = 0; i < n2; i++) {
                              responses[i][1] = response.data.responses.no[i];
                            }
                            setViewPollModal({
                              isShown: true,
                              responses: responses,
                            });
                          }}
                        ></i>
                      </p>
                    </div>
                  </div>
                );
              }
              return (
                <div className="row" key={ind}>
                  <div className="col">
                    <p
                      className={`GroupMessages__message ${
                        message.senderemail == user.email
                          ? "sender"
                          : "receiver"
                      }`}
                      onMouseEnter={(e) => {
                        editbutton = e.target.children[0];
                        deletebutton = e.target.children[1];
                        addHoverClass();
                      }}
                      onMouseLeave={() => {
                        removeHoverClass();
                      }}
                    >
                      <i
                        class="fa fa-pencil-square-o GroupMessages__edit_button GroupMessages__message_non_hover"
                        onClick={() => {
                          setUpdateMessageModal({
                            isShown: true,
                            message: message,
                            editbutton: editbutton,
                            deletebutton: deletebutton,
                          });
                        }}
                      ></i>
                      <i
                        class="fa fa-trash GroupMessages__delete_button GroupMessages__message_non_hover"
                        onClick={() => {
                          setDeleteMessageModal({
                            isShown: true,
                            message: message,
                            editbutton: editbutton,
                            deletebutton: deletebutton,
                          });
                        }}
                      ></i>

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
                if (e.key === "Enter") {
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
            <i
              class="fa fa-smile-o"
              onClick={() => {
                setEmojiText("");
                setEmojiPickerModal({ isShown: true });
              }}
            ></i>
            <i
              class="fa fa-bar-chart"
              onClick={() => {
                if (JSON.stringify(activeGroup) === JSON.stringify({})) {
                  setModal({
                    isShown: true,
                    ModalTitle: "Choose a Group...",
                    ModalBody: "Please Choose a Group to chat with...",
                  });
                  return;
                }

                setCreatePollModal({
                  isShown: true,
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
        email={user.email}
        groups={groups}
        setGroups={setGroups}
        setActiveGroup={setActiveGroup}
        setActive={setActive}
        setMessages={setMessages}
      />
      <UpdateMessageModal
        isShown={updateMessageModal.isShown}
        setIsShown={setUpdateMessageModal}
        message={updateMessageModal.message}
        editbutton={updateMessageModal.editbutton}
        deletebutton={updateMessageModal.deletebutton}
        senderemail={user.email}
        group={activeGroup}
      />
      <DeleteMessageModal
        isShown={deleteMessageModal.isShown}
        setIsShown={setDeleteMessageModal}
        message={deleteMessageModal.message}
        messages={messages}
        setMessages={setMessages}
        group={activeGroup}
        email={user.email}
        editbutton={deleteMessageModal.editbutton}
        deletebutton={deleteMessageModal.deletebutton}
      />
      <EmojiPickerModal
        isShown={emojiPickerModal.isShown}
        setIsShown={setEmojiPickerModal}
        message={message}
        setMessage={setMessage}
        emojiText={emojiText}
        setEmojiText={setEmojiText}
      />
      <CreatePollModal
        isShown={createPollModal.isShown}
        setIsShown={setCreatePollModal}
        group={activeGroup}
        user={user}
      />
      <ViewPollModal
        isShown={viewPollModal.isShown}
        setIsShown={setViewPollModal}
        responses={viewPollModal.responses}
      />
    </div>
  );
};

export default GroupMessages;
