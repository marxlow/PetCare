import React, { Component } from 'react';
import SplitLayout from 'shared/layouts/SplitLayout';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  
  onSubmit = ((event) => {

  });

  render() {
    return (
      <SplitLayout>
        <div className="d-flex align-items-center vh-100">
          <div className="row col-8">
            <h1>Welcome back to PetCare</h1>
            <form className="w-100">
              <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </SplitLayout>
    )
  }
}

export default LoginPage;