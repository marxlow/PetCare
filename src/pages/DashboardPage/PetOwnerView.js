import React, { Component } from 'react';
import { Tabs, message } from 'antd';
import PetSection from './components/PetSection';
import SearchCareTakerSection from './components/SearchCareTakerSection';
import CompletedServicesSection from './components/CompletedServicesSection';
import CurrentBidsSection from './components/CurrentBidsSection';
import WalletSection from './components/WalletSection';
import axios from 'axios';

const TabPane = Tabs.TabPane;
class PetOwnerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bids: [],
      highestamount: 0,
      bid: 0,
    }
  }
  // Get bids the current pet owners has which are not accepted or outbidded
  async componentDidMount() {
    await this.getCurrentBids();
  }

  getCurrentBids = (async () => {
    const { userId } = this.props;
    try {
      const response = await axios.post('http://localhost:3030/search', {
        post: 'getCurrentBids',
        petownerEmail: userId,
      });
      if (response.status === 200) {
        const bids = response.data;
        this.setState({ bids: bids, highestamount: bids.highestamount, bid: bids.bid });
        console.log("getCurrentBids:", bids);
      }
    } catch (err) {
      console.error("Unable to get Bids. Error: " + err.response.data)
      message.warn("Unable to get Bids");
    }
  });

  render() {
    const { userId, walletAmt, withdrawFromWallet, depositToWallet, updateWallet } = this.props;
    const { bids, highestamount, bid } = this.state;
    return (
      < Tabs type="card">
        {/* Setting pet information */}
        <TabPane tab="Profile" key="1">
          <PetSection userId={userId} />
        </TabPane>

        {/* Searching & Bidding for care takers */}
        <TabPane tab="Search" key="2">
          <SearchCareTakerSection userId={userId} updateWallet={updateWallet} getCurrentBids={this.getCurrentBids} />
        </TabPane>

        {/* List of Current Bids Pet Owner has */}
        <TabPane tab="Current Bids" key="3">
          <CurrentBidsSection
            userId={userId}
            updateWallet={updateWallet}
            walletAmt={walletAmt}
            withdrawFromWallet={withdrawFromWallet}
            getCurrentBids={this.getCurrentBids}
            bids={bids}
            bid={bid}
            highestamount={highestamount}
          />
        </TabPane>

        {/* List of Completed Services */}
        <TabPane tab="Completed Services" key="4">
          <CompletedServicesSection userId={userId} />
        </TabPane>

        {/* Wallet of user. Can Deposit or Withdraw */}
        <TabPane tab="Wallet" key="5">
          <WalletSection userId={userId} walletAmt={walletAmt} withdrawFromWallet={withdrawFromWallet} depositToWallet={depositToWallet} hasDeposit={true} />
        </TabPane>
      </Tabs>
    )
  }
}

export default PetOwnerView;