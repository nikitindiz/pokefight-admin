import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import './App.css';

const fakeFetch = (endpointUrl, dataPayload /* { username, password } */) => {
  console.log('Fetch url', endpointUrl);
  console.log('Fetch payload', dataPayload.body);

  const testUser = {
    firstName: 'Alex',
    lastName: 'Nikitin'
  };

  const promise = new Promise((res, rej) => {
    setTimeout(() => {
      res(testUser);
    }, 3000);
  });

  return promise;
};

const AuthorizedContainer = (props) => {
  const [ user, changeUser ] = useState(null);
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
      if (user) {
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
