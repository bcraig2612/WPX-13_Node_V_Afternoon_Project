import React, { Component } from 'react';
import axios from 'axios';
import './Header.css';

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      isAdmin: false,
    };
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleUsernameInput(value) {
    this.setState({ username: value });
  }

  handlePasswordInput(value) {
    this.setState({ password: value });
  }

  toggleAdmin() {
    const { isAdmin } = this.state;
    this.setState({ isAdmin: !isAdmin });
  }

  login() {
    // destructure the username and password values from state.
    const { username, password } = this.state;
    // Use axios to make a POST request to /auth/login with a body object with the username and password values from state.
    axios.post('/auth/login', { username, password })
      // Chain a .then onto the end of the .post method and provide a function that takes in a parameter called user.
      .then(user => {
        // The Header component has access to an updateUser method passed as a prop from the App component that will update the user property on state in App. Execute the updateUser method from props with user.data as an argument.
        this.props.updateUser(user.data);
        // Also in the .then, make sure to clear the input boxes by setting the username and password properties to empty strings using setState.
        this.setState({ username: '', password: '' });
      })
      // Chain a .catch onto the .then with an arrow function that references the error as a parameter.
      // Alert the error using the alert() function, passing in error.response.request.response. That chain of data leads to the string response from our server endpoint if there is an error.
      .catch(err => alert(err.response.request.response));
  }

  register() {
    // destructure username, password, and isAdmin properties from state.
    const { username, password, isAdmin } = this.state;
    // use axios to send a POST request to /auth/register.
    // Send along an object with username, password, and isAdmin properties with the correct values from state as the body of the request
    axios.post('/auth/register', { username, password, isAdmin })
      // In the .then of the axios request, set username and password on state to empty strings, using setState.
      .then(user => {
        this.setState({ username: "", password: "" });
      // Also in the .then, invoke this.props.updateUser passing in the response data from our request, so that we can update the user object on App.js.
      this.props.updateUser(user.data);
    })
    // Chain a .catch onto the .then method with a callback function that contains the error as a parameter, and alert the response.request.response. Unfortunately, that path is the only way to get access to the error string that we sent as a response if the status code is not a 201. Don't forget to clear the input boxes using setState as well.
    .catch(err => {
      this.setState({ username: "", password: "" });
      alert(err.response.request.response);
    });
}
  //  use axios to make a GET request to /auth/logout.
  logout() {
    axios.get('/auth/logout')
    // Chain a .then onto the end of the .get method. We don't need use of the response, since it is just the string 'OK' because we used the 'sendStatus' method on the backend, so just pass an arrow function without a parameter into the .then.
    .then(() => {
      // Once the response comes back from our GET request, we know the user is logged out. We now just need to modify the user object stored on state in App.js by calling the updateUser method passed through props from the App component with an empty object so that it clears all user data off of state.
      this.props.updateUser({});
    })
    // Chain a .catch onto the .then. Since we don't need to alert the user of any errors, just console.log the error for debugging purposes.
    .catch(err => console.log(err));
  }

  render() {
    const { username, password } = this.state;
    const { user } = this.props;
    return (
      <div className="Header">
        <div className="title">Dragon's Lair</div>
        {user.username ? (
          <div className="welcomeMessage">
            <h4>{user.username}, welcome to the dragon's lair</h4>
            <button type="submit" onClick={this.logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="loginContainer">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => this.handleUsernameInput(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => this.handlePasswordInput(e.target.value)}
            />
            <div className="adminCheck">
              <input type="checkbox" id="adminCheckbox" onChange={() => this.toggleAdmin()} /> <span> Admin </span>
            </div>
            <button onClick={this.login}>Log In</button>
            <button onClick={this.register} id="reg">
              Register
            </button>
          </div>
        )}
      </div>
    );
  }
}

