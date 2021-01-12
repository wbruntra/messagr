var express = require('express')
var router = express.Router()
const { Op } = require('sequelize')

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

router.get('/messages/:sender', (req, res) => {
  const username = req.session.username
  const { sender } = req.params

  console.log('msg between', username, sender)

  // [Op.or]: [
  //   {
  //     sender: username,
  //     recipient: sender,
  //   },
  // ],

  Message.findAll({
    where: {
      [Op.or]: [
        {
          recipient: username,
          sender,
        },
        {
          recipient: sender,
          sender: username,
        },
      ],
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
