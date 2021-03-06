import React, { Component } from 'react';
import AppHeader from 'shared/layouts/AppHeader';
import PetOwnerView from './PetOwnerView';
import CareTakerView from './CareTakerView';
import AdminView from './AdminView';
import axios from 'axios';
import { Divider, message } from 'antd';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'), // Read userId from localStorage for making subsequent requests
      role: localStorage.getItem('role'),
      userData: {},
      userName: 'UNKNOWN',
      wallet: 0,
      badges: { badge: '', descript: '' },
      avgRating: 'No Ratings',
    }
  }

  // Get and update wallet amount of users
  getWallet = (async () => {
    const { userId } = this.state;
    // Get Wallet
    try {
      const response = await axios.post('http://localhost:3030/wallet/', {
        post: 'getWallet',
        email: userId,
      });
      if (response.status === 200) {
        const wallet = Number(response.data.rows[0].walletamt);
        this.setState({ wallet });
      }
    } catch (err) {
      console.error("Unable to get wallet. Error: " + err.response.data)
    }
  });

  withdrawFromWallet = (async (amountToChange) => {
    const { userId } = this.state;
    const walletAmt = this.state.wallet;
    const updatedWalletAmt = walletAmt - amountToChange;
    // Guard against withdrawal amounts greater than wallet amount.
    if (updatedWalletAmt < 0) {
      message.warn(`You only have: $${walletAmt} in your wallet!`);
      return;
    }
    // Make actual withdrawal
    try {
      const response = await axios.post('http://localhost:3030/wallet', {
        email: userId,
        amt: updatedWalletAmt,
        post: 'updateWallet',
      });
      if (response.status === 200) {
        message.success(`Successfully withdrawn $${amountToChange} from wallet`);
        this.setState({ wallet: updatedWalletAmt });
      }
    } catch (error) {
      console.warn(error.message);
      message.warn('Error. Please try again later');
    }
  });

  depositToWallet = (async (amountToChange) => {
    const { userId } = this.state;
    const walletAmt = this.state.wallet;
    const updatedWalletAmt = walletAmt + amountToChange;
    // Make actual withdrawal
    try {
      const response = await axios.post('http://localhost:3030/wallet', {
        email: userId,
        amt: updatedWalletAmt,
        post: 'updateWallet',
      });
      console.log(response);
      if (response.status === 200) {
        message.success("Successfully deposited to wallet");
        this.setState({ wallet: updatedWalletAmt });
      }
    } catch (error) {
      console.warn(error.message);
      message.warn('Error. Please try again later');
    }
  });

  // Only for Care takers
  updateAvgRating = ((newRating) => {
    this.setState({ avgRating: newRating });
  });

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
    await this.getWallet();
    // Get Badges
    try {
      const response = await axios.post('http://localhost:3030/user/', {
        post: 'getBadge',
        email: userId,
      });
      if (response.status === 200) {
        const badges = response.data;
        this.setState({ badges });
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
    const { userId, role, userName, badges, wallet, avgRating } = this.state;
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
                <h5>{userName}</h5>
                <Divider />
                <h5>Badge: {badges.badge}</h5>
                <Divider />
                {role !== 'Pet Owner' ? <h5>Rating: {avgRating}</h5> : null}
              </div>
            </div>
            <div className="col-8">
              {role === 'Pet Owner' && userId !== 'admin@gmail.com' ?
                <PetOwnerView userId={userId} walletAmt={wallet} updateWallet={this.getWallet} depositToWallet={this.depositToWallet} withdrawFromWallet={this.withdrawFromWallet} forceUpdate={this.forceUpdate}/>
                : null
              }
              {role === 'Care Taker' ?
                <CareTakerView userId={userId} walletAmt={wallet} updateAvgRating={this.updateAvgRating} updateWallet={this.getWallet} withdrawFromWallet={this.withdrawFromWallet} />
                :
                null
              }
              {userId === 'admin@gmail.com' ?
                <AdminView userId={userId} />
                : null
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default DashboardPage;