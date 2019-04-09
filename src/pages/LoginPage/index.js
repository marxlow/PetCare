import React, { Component } from 'react';
import SplitLayout from 'shared/layouts/SplitLayout';
import axios from 'axios';
import { message } from 'antd';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  updateEmail = ((event) => {
    this.setState({ email: event.target.value });
  });

  updatePassword = ((event) => {
    this.setState({ password: event.target.value });
  });

  onSubmit = (async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    let response = {};
    try {
      response = await axios.post('http://localhost:3030/login/', {
        email, 
        password,
      });
      // console.log(JSON.stringify(response.data))
    } catch (err) {
      console.error("Unable to login. Invalid email or password. Error: " + err.response.data)
      message.warn("Invalid email or password")
      return
    }
    if (response.status === 200) {
      console.log("Login as " + JSON.stringify(response.data))
      const userId = response.data.email;
      const role = { petowner: response.data.petowner, caretaker: response.data.caretaker }
      
      // Write userId to localStorage. Think of local storage as a global class that all components have access to.
      localStorage.setItem('userId', userId); 

      // TODO: Depends on role from backend. To see owner view. Comment the code below and uncomment the next.
      // localStorage.setItem('role', 'caretaker'); 
      // localStorage.setItem('role', 'owner')
      localStorage.setItem('role', role); 

      this.props.history.push({
        pathname: '/',  
      });
    } else {
      console.error("Unable to login. Invalid email or password")
      message.warn("Invalid email or password")
    }
  });

  goToRegister = ((event) => {
    event.preventDefault();
    this.props.history.push('/register');
  });

  render() {
    return (
      <SplitLayout>
        <div className="d-flex align-items-center vh-100">
          <div className="row col-8">
            <h1>Welcome back to PetCare</h1>
            <form className="w-100" onSubmit={this.onSubmit}>
              <div className="form-group">
                <label for="inputEmail">Email address</label>
                <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.updateEmail} />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label for="inputPassword">Password</label>
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={this.updatePassword} />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <div>
              <button type="submit" className="btn btn-secondary mt-4" onClick={this.goToRegister}>Register</button>
            </div>
          </div>
        </div>
      </SplitLayout>
    )
  }
}

export default LoginPage;