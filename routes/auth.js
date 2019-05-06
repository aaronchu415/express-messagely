const express = require('express')
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const { JWT_SECRET } = require("../config")
const ExpressError = require("../expressError")
let router = new express.Router()

const OPTIONS = { expiresIn: 60 * 600 }; // 1 hour

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;

        const USER_AUTHEN = await User.authenticate(username, password)

        if (USER_AUTHEN) {
            await User.updateLoginTimestamp(username)
            let token = jwt.sign({ username }, JWT_SECRET, OPTIONS);
            return res.json({ token });
        }
        throw new ExpressError("Invalid user/password", 400);

    } catch (err) {
        return next(err);
    }
});



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

 router.post("/register", async function (req, res, next) {
    try {
        const {username, password, first_name, last_name, phone} = req.body;
        await User.register({username, password, first_name, last_name, phone})
        await User.updateLoginTimestamp(username)

        let token = jwt.sign({ username }, JWT_SECRET, OPTIONS);
        return res.json({ token });
        
    } catch (err) {
        return next(err)
    }
 })
module.exports = router
