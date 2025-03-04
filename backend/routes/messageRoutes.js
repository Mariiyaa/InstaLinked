const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messageController");
const router = express.Router();

router.get("/:sender/:receiver", getMessages);
router.post("/send", sendMessage);

module.exports = router;