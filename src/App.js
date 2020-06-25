import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import './App.css';

const fakeFetch = (endpointUrl, dataPayload /* { username, password } */) => {
  console.log('Fetch url', endpointUrl);
  console.log('Fetch payload', dataPayload.body);

  const etalonValues = {
    username: 'admin',
    password: '12345'
  };

  const testUser = {
    firstName: 'Alex',
    lastName: 'Nikitin'
  };

  const promise = new Promise((res, rej) => {
    setTimeout(() => {
      const user = JSON.parse(dataPayload.body);

      if (etalonValues.password === user.password && etalonValues.username === user.username) {
        res(testUser);
      } else {
        res(null);
      }
    }, 3000);
  });

  return promise;
};

const AuthorizedContainer = (props) => {
  let storedUser = localStorage.getItem('user');

  const [ user, changeUser ] = useState(storedUser);
  const [ formLogin, changeFormLoginValue ] = useState('');
  const [ formPassword, changeFormPasswordValue ] = useState('');
  const [ fetching, setFetching ] = useState(false);

  const onLoginChange = (event) => {
    changeFormLoginValue(event.target.value);
  }

  const onPasswordChange = (event) => {
    changeFormPasswordValue(event.target.value);
  }

  const onLoginFormSubmit = () => {
    setFetching(true);

    fakeFetch('http://mybackend.com/login', {
      method: 'POST',
      body: JSON.stringify({
        username: formLogin,
        password: formPassword
      }),
    }).then(user => {
      // user is an additional
      // info from server,
      // not a password and username!!!
      if (user) {
        const userAsString = JSON.stringify(user);
        localStorage.setItem('user', userAsString);

        changeUser(user);
      } else {
        changeUser(null);
      }

      setFetching(false);
    });
  };

  if (user) {
    return <div>{props.children}</div>
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" style={{ padding: 20, textAlign: 'center' }}>
        <TextField
          value={formLogin}
          label="User Name"
          onChange={onLoginChange}
          disabled={fetching}
        />

        <br/>
        <br/>

        <TextField
          value={formPassword}
          type="password"
          label="Password"
          onChange={onPasswordChange}
          disabled={fetching}
        />

        <br/>
        <br/>
        <br/>

        <Button
          onClick={onLoginFormSubmit}
          disabled={fetching}
        >
          Log in
        </Button>
      </Container>
    </React.Fragment>
  );
};

const App = () => {
  return (
    <div className="App">
      <AuthorizedContainer>
        You are logged in!
      </AuthorizedContainer>
    </div>
  );
}

export default App;
