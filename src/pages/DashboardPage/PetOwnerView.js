import React, { Component } from 'react';
import { Tabs } from 'antd';
import PetSection from './components/PetSection';
import SearchCareTakerSection from './components/SearchCareTakerSection';
import CompletedServicesSection from './components/CompletedServicesSection';
import CurrentBidsSection from './components/CurrentBidsSection';

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
          <SearchCareTakerSection />
        </TabPane>

        {/* List of Completed Services */}
        <TabPane tab="Completed Services" key="3">
          <CompletedServicesSection userId={userId} />
        </TabPane>

        {/* List of Current Bids Pet Owner has */}
        <TabPane tab="Current Bids" key="4">
          <CurrentBidsSection userId={userId} />
        </TabPane>
      </Tabs>
    )
  }
}

export default PetOwnerView;