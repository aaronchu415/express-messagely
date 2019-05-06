const express = require('express')
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const auth = require("../middleware/auth")
let router = new express.Router()

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", auth.authenticateJWT, auth.ensureLoggedIn, async function(req, res, next) {
    let response = await User.all()
    return res.json({users: response})
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

 router.get("/:username", auth.authenticateJWT, auth.ensureLoggedIn, auth.ensureCorrectUser, async function(req, res, next) {
    let response = await User.get(req.params.username)
    return res.json({user: response})

 })

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", auth.authenticateJWT, auth.ensureLoggedIn, auth.ensureCorrectUser, async function(req, res, next) {
    let response = await User.messagesTo(req.params.username)
    return res.json({messages: response})
 })


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", auth.authenticateJWT, auth.ensureLoggedIn, auth.ensureCorrectUser, async function(req, res, next) {
    let response = await User.messagesFrom(req.params.username)
    return res.json({messages: response})
 })

 module.exports = router