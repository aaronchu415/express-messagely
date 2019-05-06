/** User class for message.ly */

const bcrypt = require('bcrypt')
const { BCRYPT_WORK_ROUNDS } = require('../config')
const db = require('../db')


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {

    let hashPassword = await bcrypt.hash(password, BCRYPT_WORK_ROUNDS)

    const result = await db.query(
      `INSERT INTO users (
          username,
          password,
          first_name,
          last_name,
          phone,
          join_at)
            VALUES ($1, $2, $3, $4, $5, current_timestamp)
            RETURNING username, first_name, last_name, phone`,
      [username, hashPassword, first_name, last_name, phone]);

    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {

    //get hashpassword of user from db
    const result = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]);

    const user = result.rows[0];

    //if there is a user
    if (user) {
      //call bcrypt compare function, returns true if passwords matches else false
      if (await bcrypt.compare(password, user.password)) {
        return true
      }
    }
    return false


  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {

    //update records at username
    const result = db.query(
      `UPDATE users SET last_login_at=current_timestamp WHERE username=$1 RETURNING last_login_at`, [username])

    let userLastLoginAt = result.rows[0];

    if (!userLastLoginAt) {
      throw { message: `No such username: ${username}`, status: 404 };
    }

    return userLastLoginAt;

  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {

    //get all users infomation
    const result = await db.query(
      `SELECT username,first_name,last_name,phone FROM users`)

    return result.rows;

  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    //get current user info
    const result = await db.query(
      `SELECT username,first_name,last_name,phone,join_at,last_login_at 
      FROM users
      WHERE username=$1
      `, [username])

    let user = result.rows[0];

    //if user is undefined throw error
    if (!user) {
      throw { message: `No such username: ${username}`, status: 404 };
    }

    return user;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {

    const messagesResults = await db.query(`
      SELECT messages.id, messages.to_username, messages.body, messages.sent_at, messages.read_at
      FROM messages
      WHERE messages.from_username=$1
    `, [username])

    const userResults = await db.query(`
    SELECT username, first_name, last_name, phone
    FROM users
    WHERE username=$1
  `, [username])

    const messages = messagesResults.rows
    const userDetails = userResults.rows[0]

    return messages.map(msg => {
      msg.to_user = userDetails
      return msg
    })

  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {

    const messagesResults = await db.query(`
      SELECT messages.id, messages.to_username, messages.body, messages.sent_at, messages.read_at
      FROM messages
      WHERE messages.to_username=$1
    `, [username])

    const userResults = await db.query(`
    SELECT username, first_name, last_name, phone
    FROM users
    WHERE username=$1
  `, [username])

    const messages = messagesResults.rows
    const userDetails = userResults.rows[0]

    return messages.map(msg => {
      msg.to_user = userDetails
      return msg
    })
  }
}


// User.register({ username: 'austin12', password: 'password', first_name: 'austin', last_name: 'blah', phone: '4155555555' }).then(console.log)
// User.authenticate('austin12', 'passwoasdfrd').then(console.log)
// User.get('austin12').then(console.log)
// User.messagesFrom('austin12').then(console.log)

module.exports = User;