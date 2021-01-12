const axios = require('axios')

const run = () => {
  const users = ['bill', 'bob', 'steve']
  let user
  for (let i = 0; i < users.length; i++) {
    user = users[i]
    axios
      .post('http://localhost:3001/user', {
        name: user,
      })
      .then((response) => {
        console.log(response.data)
      })
  }
}

run()
// axios.get('http://localhost:3001').then((response) => {console.log(response.data)})
