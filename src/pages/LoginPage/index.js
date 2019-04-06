import React, { Component } from 'react';
import SplitLayout from 'shared/layouts/SplitLayout';
import axios from 'axios';

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
    const response = await axios.post('http://localhost:3030/login/', {
      email, 
      password,
    });
    if (response.status === 200) {
      const userId = response.data.email;
      // Write userId to localStorage. Think of local storage as a global class that all components have access to.
      localStorage.setItem('userId', userId);
      this.props.history.push({
        pathname: '/',  
      });
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