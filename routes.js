var express = require('express')
var router = express.Router()
const { Op } = require('sequelize')
const { client } = require('./db')

const db = require('./models/index')

const { User, Message } = db

router.get('/', function (req, res) {
  res.send({ msg: 'Ping pong' })
})

router.get('/status', function (req, res) {
  const username = req.session.username ? req.session.username : ''
  res.send({ username })
})

router.get('/users', (req, res) => {
  User.findAll().then((rows) => {
    return res.send(rows)
  })
})

router.post('/user', (req, res) => {
  const { name } = req.body
  req.session.username = name

  User.findOne({
    where: {
      name,
    },
  })
    .then((user) => {
      if (user) {
        return res.json({ exists: true })
      }
      User.create({
        name,
      })
        .then((user) => {
          return res.json({ ...user, exists: false })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/user/create', (req, res) => {
  const { name } = req.body
  req.session.username = name

  User.findOne({
    where: {
      name,
    },
  })
    .then((user) => {
      if (user) {
        return res.json({ exists: true })
      }
      User.create({
        name,
      })
        .then((user) => {
          return res.json({ ...user, exists: false })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/messages/unread', async (req, res) => {
  const username = req.session.username

  console.log('get unread for', username)

  const messages = await client
    .select('sender')
    .from('Messages')
    .where({
      recipient: username,
    })
    .whereNot({
      read: 1,
    })
    .groupBy('sender')
    .count('*', { as: 'unreadCount' })

  return res.json(messages)
})

router.get('/messages/refresh/:sender', async (req, res) => {
  const thisUser = req.session.username
  const { sender: otherUser } = req.params

  console.log('refresh', thisUser)

  const messages = await client.select().from('Messages').where({
    recipient: thisUser,
    sender: otherUser,
    read: 0,
  })

  await client
    .select()
    .from('Messages')
    .where({
      recipient: thisUser,
      sender: otherUser,
      read: 0,
    })
    .update({ read: 1 })

  return res.json(messages)
})

router.get('/messages/:sender', async (req, res) => {
  const thisUser = req.session.username
  const { sender: otherUser } = req.params

  console.log('msg between', thisUser, otherUser)

  await client
    .select()
    .from('Messages')
    .where({
      sender: otherUser,
      recipient: thisUser,
    })
    .update({ read: 1 })

  const messages = await client
    .select()
    .from('Messages')
    .where({
      sender: thisUser,
      recipient: otherUser,
    })
    .orWhere({
      recipient: thisUser,
      sender: otherUser,
    })

  return res.json(messages)
})

router.get('/messages', (req, res) => {
  const { username } = req.session.username

  Message.findAll({
    where: {
      recipient: username,
    },
  })
    .then((messages) => {
      return res.json(messages)
    })
    .catch((err) => {
      console.log(err)
      return res.sendStatus(500)
    })
})

router.post('/message', (req, res) => {
  const username = req.session.username
  const { recipient, content } = req.body

  Message.create({
    sender: username,
    recipient,
    content,
  }).then((message) => {
    res.send(message)
  })
})

router.get('/logout', (req, res) => {
  req.session = null
  res.send('OK')
})

module.exports = router
