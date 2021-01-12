import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useHistory, Link } from 'react-router-dom'
import dateFormat from 'dateformat'

const Single = (props) => {
  const { currentUser } = props
  const params = useParams()
  const sendingTo = params.user

  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const sendMessage = (e) => {
    e.preventDefault()
    const send = async () => {
      const res = await axios.post('/api/message', {
        recipient: sendingTo,
        content: message,
      })
      return res
    }
    send().then((res) => {
      setMessage('')
      setMessages([...messages, res.data])
    })
  }

  const getMessages = async (sendingTo) => {
    const res = await axios.get(`/api/messages/${sendingTo}`)
    console.log('refresh', dateFormat(new Date(), 'h:MM:ss'))
    setMessages(res.data)
  }

  useEffect(() => {
    const prog = () => {
      return window.setInterval(() => {
        getMessages(sendingTo)
      }, 15000)
    }
    const intervalId = prog()

    return () => window.clearInterval(intervalId)
  }, [sendingTo])

  useEffect(() => {
    getMessages(sendingTo)
  }, [sendingTo])

  return (
    <>
      <p>
        <Link className="text-link ml-4" to="/">
          {' '}
          Home{' '}
        </Link>
      </p>
      <p>Messages with: {sendingTo}</p>
      {messages.length === 0 && <p>No messages!</p>}
      <div className="message-history d-flex flex-column">
        {messages.map((m) => {
          return (
            <div
              key={m.id}
              className={`message-box my-2 shadow ${currentUser == m.sender ? 'own-message' : ''}`}
            >
              <div className="row">
                <div className="col-9">
                  <p>{m.content}</p>
                </div>
                <div className="col-3 text-right">{dateFormat(m.createdAt, 'h:MM TT')}</div>
              </div>
            </div>
          )
        })}
      </div>

      <form className="chat-form" onSubmit={sendMessage}>
        <div className="row">
          <div className="col-10">
            <input
              autoFocus
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
              }}
            />
          </div>

          <div className="col-2">
            <input type="submit" className="btn btn-primary" value=">" />
          </div>
        </div>
      </form>
    </>
  )
}

export default Single
