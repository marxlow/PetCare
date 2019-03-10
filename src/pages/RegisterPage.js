import React, { Component } from 'react';
import SplitLayout from 'shared/layouts/SplitLayout';

class RegisterPage extends Component {
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

  onSubmit = ((event) => {
    // TODO: API call to register user
    event.preventDefault();
    this.props.history.push('/login');
  });

  render() {
    return (
      <SplitLayout>
        <div className="d-flex align-items-center vh-100">
          <div className="row col-8">
            <h1>Register to PetCare</h1>
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
          </div>
        </div>
      </SplitLayout>
    )
  }
}

export default RegisterPage;