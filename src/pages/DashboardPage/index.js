import React, { Component } from 'react';
import AppHeader from 'shared/layouts/AppHeader';
import PetOwnerView from './PetOwnerView';
import CareTakerView from './CareTakerView';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'), // Read userId from localStorage for making subsequent requests
      role: localStorage.getItem('role'),
      userData: {},
    }
  }

  onLogout = ((e) => {
    e.preventDefault();
    localStorage.clear(); // Remove all key/value pair in localstorage
    this.props.history.push('/login');
  });

  onSearch = ((e) => {
    e.preventDefault();
    this.props.history.push('/search');
  });

  render() {
    const { userId, role } = this.state;
    if (!localStorage.getItem('role') || role === null) {
      localStorage.clear(); // Remove all key/value pair in localstorage
      this.props.history.push('/login');
    }
    return (
      <div>
        <AppHeader onLogout={this.onLogout} onSearch={this.onSearch} />
        <div className="d-flex flex-column align-items-center">
          {/*  */}
          <div className="row w-100 mt-4">
            <div className="col-sm-4 col-lg-3">
              {/* Profile Section */}
              <div className="card border-0">
                <img className="card-img-top rounded-circle" src="https://www.freeiconspng.com/uploads/jake-the-dog-cartoon-characters-adventure-time-png--18.png" alt="profile" />
              </div>
              <div className="d-flex flex-column align-items-center mt-4">
                <h4>Bob</h4>
                <h4>{userId}</h4>
              </div>
            </div>
            <div className="col-8">
              {role === 'owner' ?
                <PetOwnerView userId={userId} />
                :
                <CareTakerView userId={userId} />
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default DashboardPage;