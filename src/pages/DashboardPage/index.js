import React, { Component } from 'react';
import AppHeader from 'shared/layouts/AppHeader';
import PetOwnerView from './PetOwnerView';
import CareTakerView from './CareTakerView';
import axios from 'axios';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'), // Read userId from localStorage for making subsequent requests
      role: localStorage.getItem('role'),
      userData: {},
      userName: 'UNKNOWN',
      wallet: 0,
      badges: [],
      avgRating: 0,
    }
  }

  // When component is loaded. Fetch Name and badges for User and avg ratings for caretaker 
  async componentDidMount() {
    const { userId } = this.state;
    // Get Username
    try {
      const response = await axios.post('http://localhost:3030/user/', {
        post: 'getUserName',
        email: userId,
      });
      if (response.status === 200) {
        const userName = response.data.name;
        this.setState({ userName: userName });
      }
    } catch (err) {
      console.error("Unable to get user name. Error: " + err.response.data)
    }
    // Get Wallet
    try {
      const response = await axios.post('http://localhost:3030/user/', {
        post: 'getWallet',
        email: userId,
      });
      if (response.status === 200) {
        const wallet = response.data.wallet;
        this.setState({ wallet });
      }
    } catch (err) {
      console.error("Unable to get wallet. Error: " + err.response.data)
    }
    // Get Badges
    try {
      const response = await axios.post('http://localhost:3030/user/', {
        post: 'getBadges',
        email: userId,
      });
      if (response.status === 200) {
        const badges = response.data.badges;
        this.setState({ badges });
      }
    } catch (err) {
      console.error("Unable to get Badges. Error: " + err.response.data)
    }
    //Get Avg rating for caretaker
    try {
      const response = await axios.post('http://localhost:3030/user/', {
        post: 'getAvgRating',
        email: userId,
      });
      if (response.status === 200) {
        const avgRating = response.data.avgRating;
        this.setState({ avgRating });
      }
    } catch (err) {
      console.error("Unable to get Badges. Error: " + err.response.data)
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
    const { userId, role, userName } = this.state;
    if ( !localStorage.getItem('role') || role === null ){
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
                <h4>{userName}</h4>
                <h4>{role}</h4>
                <h4>{userId}</h4>
              </div>
            </div>
            <div className="col-8">
              {role === 'Pet Owner' ?
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