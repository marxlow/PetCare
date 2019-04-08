import React, { Component } from 'react';
import SplitLayout from 'shared/layouts/SplitLayout';
import axios from 'axios';

const NOT_INT = 'NotInt';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      phone: '',
      options: [{ role: 'Pet Owner', chosen: true }, { role: 'Care Taker', chosen: false }]
    };
  }

  updateEmail = ((event) => {
    this.setState({ email: event.target.value });
  });

  updateName = ((event) => {
    this.setState({ name: event.target.value });
  });

  updatePassword = ((event) => {
    this.setState({ password: event.target.value });
  });

  updatePhone = ((event) => {
    let phone = event.target.value.trim().replace(/\s/g,'') // Removes all whitespace
    //Is not Numeric
    if (isNaN(phone)) {
      phone = NOT_INT
    }
    this.setState({ phone: phone });
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
    const { email, name, password, phone } = this.state;
    if (phone === NOT_INT) {
      console.log("Input Contact Number is not Numeric.")
      return
    }

    let response = {};
    try {
      response = await axios.post('http://localhost:3030/register/', {
        email,
        name,
        password,
        phone,
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

  onCancel = ((event) => {
    this.props.history.push('/login');
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
                <label for="inputName">Name</label>
                <input type="text" className="form-control" id="inputName" placeholder="Name" onChange={this.updateName} />
              </div>
              <div className="form-group">
                <label for="inputPhone">Contact Number</label>
                <input type="text" className="form-control" id="inputEmail" placeholder="Contact Number" onChange={this.updatePhone} />
                <small id="phoneHelp" className="form-text text-muted">Please Key in only numbers Eg. 12345678. We'll never share your contact number with anyone else.</small>
              </div>
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
            <button type="submit" className="btn btn-danger" onClick={this.onCancel}>Cancel</button>
          </div>
        </div>
      </SplitLayout>
    )
  }
}

export default RegisterPage;