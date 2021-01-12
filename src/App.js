import './App.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Single from './Single'
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom'

const PageHeader = ({ currentUser, reset }) => {
  let history = useHistory()
  const logOut = () => {
    axios.get('/api/logout').then((res) => {
      reset()
      history.push('/')
    })
  }
  return (
    <p>
      You are: {currentUser}
      <span className="text-black logout pl-3" onClick={logOut}>
        (Log out)
      </span>
    </p>
  )
}

const Main = ({ currentUser }) => {
  const [users, setUsers] = useState([])

  let history = useHistory()

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get('/api/users')
      console.log(res.data)
      setUsers(res.data)
    }

    getUsers()
  }, [])

  return (
    <>
      <p>We are all friends!</p>
      <p>Send a message to a friend</p>
      <ul className="list-group friends">
        {users.map((u) => {
          if (u.name !== currentUser) {
            return (
              <li
                key={u.id}
                className="list-group-item mb-2 w-50"
                onClick={() => {
                  history.push(`/chat/${u.name}`)
                }}
              >
                {u.name}
              </li>
            )
          }
        })}
      </ul>
    </>
  )
}

const App = () => {
  const [currentUser, setCurrentUser] = useState('')
  const [loginName, setLoginName] = useState('')
  const [confirmed, setConfirmed] = useState(true)
  const [isNewUser, setIsNewUser] = useState(true)
  const [saidNo, setSaidNo] = useState(false)

  const reset = () => {
    setCurrentUser('')
    setConfirmed(false)
    setLoginName('')
  }

  useEffect(() => {
    const getStatus = async () => {
      const res = await axios.get('/api/status')
      const u = res.data.username
      console.log('user is', u)
      if (u) {
        setCurrentUser(u)
      } else {
        setConfirmed(false)
      }
    }

    getStatus()
  }, [])

  const handleInit = (e) => {
    e.preventDefault()
    setCurrentUser(loginName)
  }

  const handleSignIn = () => {
    console.log('sign in')
    axios
      .post('/api/user', {
        name: loginName,
      })
      .then((res) => {
        const exists = res.data.exists
        console.log(res.data)
        setIsNewUser(!exists)
        // setCurrentUser(loginName)
        setConfirmed(true)
      })
  }

  if (currentUser === '') {
    return (
      <div className="App container">
        <header className="App-header">
          <p>{saidNo ? "Okay, let's try again." : ''} Sign in:</p>
          <form onSubmit={handleInit}>
            <div className="form-group">
              <label for="login-input">Username</label>
              <input
                id="login-input"
                autoFocus
                value={loginName}
                className="form-control w-25"
                onChange={(e) => {
                  setLoginName(e.target.value)
                }}
              />
            </div>
            <input className="btn btn-secondary" type="submit" />
          </form>
        </header>
      </div>
    )
  }

  if (currentUser && !confirmed) {
    return (
      <div className="App container">
        <h1>Multi-factor authentication</h1>
        <p>
          Hey, are you <span className="bold">really</span> {currentUser}?
        </p>
        <div className="row">
          <div className="col-2">
            <button className="btn btn-secondary" onClick={() => handleSignIn()}>
              Yes
            </button>
          </div>
          <div className="col-2">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setCurrentUser('')
                setLoginName('')
                setSaidNo(true)
              }}
            >
              No
            </button>
          </div>
        </div>
        <p className="pt-3">Please tell the truth.</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="App container">
        <PageHeader currentUser={currentUser} reset={reset} />
        <Switch>
          <Route path="/chat/:user">
            <Single currentUser={currentUser} />
          </Route>
          <Route path="/">
            <Main currentUser={currentUser} />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
