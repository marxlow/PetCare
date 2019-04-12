import React, { Component } from 'react';
import { Button, List, Tabs, message, InputNumber, Rate } from 'antd';
import axios from 'axios';
import DateSection from './components/DateSection';
import WalletSection from './components/WalletSection';
import moment from 'moment';
import iterateRangeOfDate from '../../utils/iterateRangeOfDate';

const TabPane = Tabs.TabPane;
const ListItem = List.Item;
const ListItemMeta = ListItem.Meta;

class CareTakerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      availabilitiesRange: [],
      availbilitiesDay: [],
      bids: [], //{"bid":1,"dateofservice":"2018-12-31T16:00:00.000Z","bidderemail":"po@hotmail.com","bidamount":100}
      startDate: '',
      endDate: '',
      autoAcceptedPrice: 1000,
      selectedService: '',
      serviceOptions: [], //{serviceid}
      services: [], //{serviceid}
      reviews: [],
      workDates: [], //{DateOfService, bidderEmail, bidAmount}
    }
  }

  updateAutoAcceptedPrice = ((value) => {
    this.setState({ autoAcceptedPrice: value });
  });

  // When component is loaded. Fetch all availabilities for care taker
  async componentDidMount() {
    await this.getDatesForCareTaker();
    await this.getAvgRating();
    await this.getAllAvailableServices();
    await this.getMyService();
    await this.getBids();
    await this.getWorkDates();
    await this.getReviews();
  }

  // Fetch average ratings for care taker 
  getAvgRating = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAvgRating',
        email: userId,
      });
      if (response.status === 200) {
        const avgRating = response.data.avgrating;
        if (avgRating) {
          this.props.updateAvgRating(avgRating);
        }
      }
    } catch (err) {
      console.error("Unable to get Average Rating. Error: " + err.response.data)
      message.warn("Unable to get Avrage Rating");
    }
  });

  // SERVICE FUNCTIONS
  updateSelectedService = ((event) => {
    this.setState({ selectedService: event.target.value });
  });

  getAllAvailableServices = (async () => {
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAllService',
      });
      if (response.status === 200) {
        const serviceOptions = response.data;
        this.setState({ serviceOptions: serviceOptions, selectedService: serviceOptions[0].serviceid });
      }
    } catch (err) {
      console.error("Unable to get Services. Error: " + err.response.data)
      message.warn("Unable to get all Service options");
    }
  });

  getMyService = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getMyService',
        email: userId
      });
      if (response.status === 200) {
        const services = response.data;
        this.setState({ services: services });
      }
    } catch (err) {
      console.error("Unable to get User's services. Error: " + err.response.data)
      message.warn("Unable to get your services");
    }
  });

  addService = (async () => {
    const { userId, selectedService } = this.state;
    console.log("addingService:", selectedService);
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'addService',
        email: userId,
        services: [selectedService],
      });
      if (response.status === 200) {
        const nextServices = response.data;
        this.setState({ services: nextServices });
        console.log("New User's services:", nextServices);
      }
    } catch (err) {
      console.error("Unable to add User's service. Error: " + err.response.data)
      message.warn("Unable to add your service");
    }
  });

  removeService = (async (key) => {
    const { userId, services } = this.state;
    if (services.length === 0) {
      return;
    }
    const serviceToRemove = services[key].serviceid;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'removeService',
        email: userId,
        services: [serviceToRemove],
      });
      if (response.status === 200) {
        const nextMyServices = response.data;
        this.setState({ services: nextMyServices });
        console.log("New User's services:", nextMyServices);
      }
    } catch (err) {
      console.error("Unable to remove User's service. Error: " + err.response.data)
      message.warn("Unable to remove your services");
    }
  });

  // REVIEWS SECTION
  getReviews = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/review', {
        post: 'getReviewsForUser',
        email: userId,
      });
      if (response.status === 200) {
        const reviews = response.data;
        this.setState({ reviews: reviews });
      }
    } catch (err) {
      console.error("Unable to get Reviews. Error: " + err.response.data)
      message.warn("Unable to get Reviews");
    }
  });

  // WORK DATES SECTION
  getWorkDates = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getWorkDates',
        email: userId,
      });
      if (response.status === 200) {
        const workDates = response.data;

        // Sort in order of Dates
        workDates.sort((a, b) => {
          if (!a || !b) { return; }
          // Turn your strings into dates, and then s ubtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(a.dateofservice) - new Date(b.dateofservice);
        });

        this.setState({ workDates: workDates });
        console.log("getWorkDates:", workDates);
      }
    } catch (err) {
      console.error("Unable to get Work Dates. Error: " + err.response.data)
      message.warn("Unable to get Work Dates");
    }
  });

  // BIDS SECTION
  getBids = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getBids',
        email: userId,
      });
      if (response.status === 200) {
        let bids = response.data;
        bids = bids.filter((bid) => {
          if (Number(bid.bidamount) > 0) {
            return true;
          } else {
            return false;
          }
        })
        this.setState({ bids: bids });
        console.log("getBids:", bids);
      }
    } catch (err) {
      console.error("Unable to get Bids. Error: " + err.response.data)
      message.warn("Unable to get Bids");
    }
  });

  acceptBid = (async (bid) => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'acceptBid',
        email: userId,
        bid,
      });
      if (response.status === 200) {
        const workDates = response.data.workdates;
        const availabilities = response.data.availabilities;
        this.setState({ availabilities, workDates });
        console.log("acceptBid:", workDates);
      }
    } catch (err) {
      console.error("Unable to accept Bid. Error: " + err.response.data)
      message.warn("Unable to accept Bid");
    }
    await this.getBids();
  });

  // AVAILABILITIES SECTION
  getDatesForCareTaker = (async () => {
    let availabilities = []
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAvailability',
        email: this.state.userId,
      });
      if (response.status === 200) {
        availabilities = response.data;
        this.setState({
          availabilitiesRange: availabilities,
          availbilitiesDay: iterateRangeOfDate(availabilities),
        });
      }
    } catch (err) {
      console.error("Unable to get Availabilities. Error: " + err.response.data)
      message.warn("Unable to get Availabilities.");
    }
  });

  setAvailabilityForCareTaker = (async () => {
    // Create new availbility object to send to backend
    const { startDate, endDate, autoAcceptedPrice, userId } = this.state;
    const newAvailability = {
      post: 'addAvailability',
      startDate,
      endDate,
      autoAcceptedPrice,
      email: userId
    }

    let availabilities = []
    try {
      const response = await axios.post('http://localhost:3030/caretaker', newAvailability);
      if (response.status === 200) {
        availabilities = response.data;
        availabilities = response.data;
        this.setState({
          availabilitiesRange: availabilities,
          availbilitiesDay: iterateRangeOfDate(availabilities),
        });
      }
    } catch (err) {
      console.error("Unable to set Availabilities. Error: " + err.response.data)
      message.warn("Unable to add Availabilities", newAvailability);
      return;
    }
  });

  removeAvailabilities = (async (date) => {
    const { userId } = this.state;
    let availabilities = []
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'removeAvailabilities',
        email: userId,
        dateToRemove: date,
      });
      if (response.status === 200) {
        availabilities = response.data;
        availabilities = response.data;
        this.setState({
          availabilitiesRange: availabilities,
          availbilitiesDay: iterateRangeOfDate(availabilities),
        });
      }
    } catch (err) {
      console.error("Unable to remove Availabilities. Error: " + err.response.data)
      message.warn("Unable to remove Availability", date);
      return;
    }
  });

  // Returns a boolean whether a date should be disabled or not
  disabledDate = ((date) => {
    const { availabilitiesRange } = this.state;
    for (let i = 0; i < availabilitiesRange.length; i++) {
      const startdateObj = moment(availabilitiesRange[i].startdate);
      const enddateObj = moment(availabilitiesRange[i].enddate);
      const dateObj = moment(date);
      // Is inbetween
      if (dateObj.isSameOrBefore(enddateObj, 'day') && dateObj.isSameOrAfter(startdateObj, 'day')) {
        return true;
      }
    }
    return false;
  });

  changeDate = ((startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
    });
  });



  render() {
    const { reviews, serviceOptions, services, workDates, bids } = this.state;
    console.log("Bids:", JSON.stringify(bids));
    return (
      < Tabs type="card">

        {/* Adding availabilities */}
        <TabPane tab="Profile" key="1">
          <div className="w-100 d-flex">
            <section className="d-flex flex-column col-6">
              <h3>Add your availabilities here</h3>
              <DateSection changeDate={this.changeDate} title={""} disabledDate={this.disabledDate} />
              <span>Select your available dates</span>
              <InputNumber
                defaultValue={this.state.autoAcceptedPrice}
                className={"mt-4"}
                size={'large'}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.updateAutoAcceptedPrice}
              />
              <span>Enter your minimum acceptance bid. Any bid that goes above this amount will be automatically accepted.</span>
              <Button className="mt-4" onClick={this.setAvailabilityForCareTaker}>Add new Availability</Button>
            </section>
            <section className="col-6">
              <h3>List of Availabilities</h3>
              <List
                dataSource={this.state.availbilitiesDay}
                renderItem={(item) => (
                  <List.Item>
                    <ListItemMeta title={item} />
                    <Button icon="delete" onClick={(() => this.removeAvailabilities(item))}>Delete Availability</Button>
                  </List.Item>
                )}
              />
            </section>
          </div>
        </TabPane>

        {/* Service panel */}
        <TabPane tab="Services" key="2">
          <div className="w-100 d-flex">
            <div className="form-group col-6">
              <label for="inputState">Services</label>
              <select id="inputState" className="form-control" onChange={this.updateSelectedService}>
                {serviceOptions.map((service, key) => (
                  <option key={key} value={service.serviceid}>{service.serviceid}</option>
                ))}
              </select>
              <Button className="mt-4" icon="plus" onClick={this.addService}>Add selected service</Button>
            </div>
            <div className="col-6">
              <h3>List of Services</h3>
              <List
                bordered
                dataSource={services}
                renderItem={(service, key) => (
                  <List.Item>
                    <div className="d-flex w-100 justify-content-between">
                      <span>{service.serviceid}</span>
                      <Button icon="delete" onClick={(() => this.removeService(key))}>Delete service</Button>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </TabPane>

        {/* Work Hx and Reviews of care taker */}
        <TabPane tab="Your Past Work" key="3">
          <div className="w-100">
            <List
              bordered
              itemLayout="horizontal"
              dataSource={reviews}
              renderItem={((review) => {
                return (
                  <List.Item>
                    <div className="w-100">
                      <ListItemMeta
                        title={`From ${review.bidderemail}`}
                      />
                      <div className="d-flex flex-column">
                        <Rate disabled value={review.rating} />
                        <span className="mt-2">{review.dateofservice}</span>
                        <span className="mt-2">{review.review}</span>
                      </div>
                    </div>
                  </List.Item>
                )
              })}
            />
          </div>
        </TabPane>

        {/* Work to be done by care taker */}
        <TabPane tab="Your Work Dates" key="4">
          <div className="w-100 d-flex">
            <List
              bordered
              dataSource={workDates}
              renderItem={((item) => {
                return (
                  <List.Item>
                    <div className="w-100">
                      <ListItemMeta
                        title={item.bidderemail}
                        description={item.dateofservice}
                      />
                      <span className="mt-1">${item.bidamount}</span>
                    </div>
                  </List.Item>
                )
              })}
            />
          </div>
        </TabPane>

        {/* Bids */}
        <TabPane tab="Your Bids" key="5">
          <div className="w-100 d-flex flex-column">
            <h3>List of Bids</h3>
            <List
              bordered
              dataSource={bids}
              renderItem={(item) => (
                <List.Item>
                  <ListItemMeta
                    title={item.dateofservice}
                    description={`Amount:$${item.bidamount} | ${item.bidderemail}`}
                  />
                  <Button icon="submit" onClick={(() => this.acceptBid(item.bid))}>Accept</Button>
                </List.Item>
              )}
            />
          </div>
        </TabPane>

        {/* Care taker's Wallet only have withdraw functionalities. */}
        <TabPane tab="Wallet" key="6">
          <WalletSection userId={this.state.userId} walletAmt={this.props.walletAmt} hasDeposit={false} />
        </TabPane>
      </Tabs>
    )
  }
}

export default CareTakerView;