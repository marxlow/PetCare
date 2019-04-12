import React, { Component } from 'react';
import { Tabs } from 'antd';
import PetSection from './components/PetSection';
import SearchCareTakerSection from './components/SearchCareTakerSection';
import CompletedServicesSection from './components/CompletedServicesSection';
import CurrentBidsSection from './components/CurrentBidsSection';
import WalletSection from './components/WalletSection';

const TabPane = Tabs.TabPane;
class PetOwnerView extends Component {
  render() {
    const { userId, walletAmt } = this.props;
    return (
      < Tabs type="card">
        {/* Setting pet information */}
        <TabPane tab="Profile" key="1">
          <PetSection userId={userId} />
        </TabPane>

        {/* Searching & Bidding for care takers */}
        <TabPane tab="Search" key="2">
          <SearchCareTakerSection userId={userId} updateWallet={this.props.updateWallet} />
        </TabPane>

        {/* List of Current Bids Pet Owner has */}
        <TabPane tab="Current Bids" key="3">
          <CurrentBidsSection userId={userId} updateWallet={this.props.updateWallet} />
        </TabPane>

        {/* List of Completed Services */}
        <TabPane tab="Completed Services" key="4">
          <CompletedServicesSection userId={userId} />
        </TabPane>

        {/* Wallet of user. Can Deposit or Withdraw */}
        <TabPane tab="Wallet" key="5">
          <WalletSection userId={userId} walletAmt={walletAmt} hasDeposit={true} />
        </TabPane>
      </Tabs>
    )
  }
}

export default PetOwnerView;