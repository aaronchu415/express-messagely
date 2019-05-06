const express = require('express')
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const auth = require("../middleware/auth")
const msg = require("../models/message")
const { accountSid, authToken } = require("../config")
const clientTwilio = require("twilio")(accountSid, authToken)



let router = new express.Router()
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", auth.authenticateJWT, auth.ensureLoggedIn, auth.validUser, async function(req, res, next) {
    let response = await msg.get(req.params.id)
    return res.json({message: response})
})



/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", auth.authenticateJWT, auth.ensureLoggedIn, async function(req, res, next) {
    let response = await msg.create({ from_username: req.user.username, to_username: req.body.to_username, body: req.body.body})
    console.log("Got to this route")
    clientTwilio.messages
        .create({from: '+16507537282', body: "You got a message!", to: "+16507733650"})
    return res.json({message: response})
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", auth.authenticateJWT, auth.ensureLoggedIn, auth.recepientOnly, async function(req, res, next) {
    let response = await msg.markRead(req.params.id)
    return res.json({message: response})
})


module.exports = router