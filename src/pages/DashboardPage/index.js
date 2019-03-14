import React, { Component } from 'react';
import AppHeader from 'shared/layouts/AppHeader';
import { Tabs } from 'antd';
import PetSection from './components/PetSection';
import DateSection from './components/DateSection';
import CareTakerSearchSection from './components/CareTakerSearchSection';

const TabPane = Tabs.TabPane;

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: [],
    }
  }

  onLogout = ((e) => {
    e.preventDefault();
    this.props.history.push('/login');
  });

  onSearch = ((e) => {
    e.preventDefault();
    this.props.history.push('/search');
  });

  render() {
    return (
      <div>
        <AppHeader onLogout={this.onLogout} onSearch={this.onSearch} />
        <div className="d-flex flex-column align-items-center">
          {/*  */}
          <div className="row w-100 mt-4">
            <div className="col-sm-4 col-lg-3">
              {/* Profile Section */}
              <div className="card border-0">
                <img className="card-img-top rounded-circle" src="http://placehold.it/200x200" alt="profile" />
              </div>
              <div className="d-flex flex-column align-items-center mt-4">
                <h4>Bob</h4>
                <h4>Bob@gmail.com</h4>
              </div>
            </div>
            <div className="col-8">
              {/* Tabs */}
              <Tabs type="card">
                {/* Setting pet information */}
                <TabPane tab="Profile" key="1">
                  <PetSection pets={this.state.pets}/>
                </TabPane>

                {/* Setting dates that each dog wants to be taken care of */}
                {/* <TabPane tab="Dates" key="2">
                  <DateSection />
                </TabPane> */}

                {/* Searching & Bidding for care takers */}
                <TabPane tab="Search" key="3">
                  <CareTakerSearchSection />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DashboardPage;