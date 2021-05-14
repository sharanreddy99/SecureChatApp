import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "unicode-emoji-picker";
import "./EmojiPickerModal.css";

const EmojiPickerModal = ({
  isShown,
  setIsShown,
  emojiText,
  setEmojiText,
  message,
  setMessage,
}) => {
  //States
  const [isEmojiPicked, setIsEmojiPicked] = useState(false);

  //Effects
  useEffect(() => {
    const emojiPicker = document.querySelector("unicode-emoji-picker");
    if (isEmojiPicked) {
      emojiPicker.addEventListener("emoji-pick", (event) => {
        var ele = document.getElementById("emojiTextInput");
        setEmojiText(ele.value + event.detail.emoji);
      });
    }

    return () => {
      if (isEmojiPicked) {
        emojiPicker.removeEventListener("emoji-pick", (event) => {});
      }
    };
  }, [isEmojiPicked]);

  const handleClose = () => {
    setIsEmojiPicked(false);
    setIsShown({ isShown: false });
  };

  const addEmojiHandler = () => {
    setMessage(message + emojiText);
    handleClose();
  };

  return (
    <Modal
      show={isShown}
      onHide={handleClose}
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "var(--modalHeaderBackground)",
          color: "var(--modalHeaderText)",
          textShadow: "2px 2px var(--modalTextShadow)",
        }}
      >
        <Modal.Title>Emoji Picker</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontWeight: "bold" }}>
        <input
          type="textarea"
          style={{
            backgroundColor: "var(--emojiBoxColor)",
            color: "var(--emojiTextColor)",
          }}
          id="emojiTextInput"
          class="form-control"
          placeholder="No Emoji Chosen"
          value={emojiText}
          onChange={(e) => {
            setEmojiText(e.target.value);
          }}
        />
        <unicode-emoji-picker
          onClick={() => {
            setIsEmojiPicked(true);
          }}
          default-group="search"
        ></unicode-emoji-picker>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: "var(--modalButtonBackground)",
            color: "var(--modalButtonText)",
            fontWeight: "bold",
          }}
          onClick={addEmojiHandler}
        >
          Add Emojis
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
  );
};
export default EmojiPickerModal;
