import React, { Component } from 'react';
import { Tabs } from 'antd';
import PetSection from './components/PetSection';
import CareTakerSearchSection from './components/CareTakerSearchSection';
import BidHistorySection from './components/BidHistorySection';

const TabPane = Tabs.TabPane;
class PetOwnerView extends Component {
  render() {
    const { userId } = this.props;
    return (
      < Tabs type="card">
        {/* Setting pet information */}
        <TabPane tab="Profile" key="1">
          <PetSection userId={userId} />
        </TabPane>

        {/* Searching & Bidding for care takers */}
        <TabPane tab="Search" key="2">
          <CareTakerSearchSection />
        </TabPane>

        {/* History of Successful bids */}
        <TabPane tab="History" key="3">
          <BidHistorySection userId={userId} />
        </TabPane>
      </Tabs>
    )
  }
}

export default PetOwnerView;