import React, { Component } from 'react';
import SplitLayout from 'shared/layouts/SplitLayout';
import axios from 'axios';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      options: [{ role: 'Pet Owner', chosen: true }, { role: 'Care Taker', chosen: false }]
    };
  }

  updateEmail = ((event) => {
    this.setState({ email: event.target.value });
  });

  updatePassword = ((event) => {
    this.setState({ password: event.target.value });
  });

  getRole = (() => {
    const options = this.state.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].chosen === true){
        return options[i].role
      }
    }
    return 'None' //Error should not reach here
  })

  onSubmit = (async (event) => {
    // TODO: API call to register user
    event.preventDefault();
    const { email, password } = this.state;
    const response = {};
    try {
      response = await axios.post('http://localhost:3030/register/', {
        email,
        password,
        role: this.getRole()
      });
    } catch (err) {
      console.error("Error creating profile. Error: " + err.message)
    }
    if (response.status === 200) {
      console.log("Response> " + response.data)
      this.props.history.push('/login');
    } else {
      // TODO: Show error
      console.error("Error creating profile. Status: " + response.status)
    }
  });

  onUpdateRole = ((event) => {
    const nextOptions = this.state.options;
    for (let i = 0; i < nextOptions.length; i++) {
      if (nextOptions[i].role === event.target.value.trim()) {
        nextOptions[i].chosen = true;
      } else {
        nextOptions[i].chosen = false;
      }
    }
    this.setState({ options: nextOptions });
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
              <div className="form-group">
                <label for="inputState">Role</label>
                <select id="inputState" className="form-control" onChange={this.onUpdateRole}>
                  {this.state.options.map((opt, key) => {
                    return (
                      opt.chosen
                        ? <option selected key={key} value={opt.role}>{opt.role}</option>
                        : <option key={key} value={opt.role}>{opt.role}</option>
                    )
                  })}
                </select>
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