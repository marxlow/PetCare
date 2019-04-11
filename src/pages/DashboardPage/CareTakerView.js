import React, { Component } from 'react';
import { Button, List, Tabs, message, InputNumber } from 'antd';
import axios from 'axios';
import DateSection from './components/DateSection';
import { relativeTimeRounding } from 'moment';

const TabPane = Tabs.TabPane;
const ListItem = List.Item;
const ListItemMeta = ListItem.Meta;

class CareTakerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      availabilities: [],
      startDate: '',
      endDate: '',
      autoAcceptedPrice: 1000,
      selectedService: '',
      serviceOptions: [],
      services: [],
      reviews: [],
    }
  }

  updateAutoAcceptedPrice = ((value) => {
    this.setState({ autoAcceptedPrice: value });
  });

  // When component is loaded. Fetch all availabilities for care taker
  async componentDidMount() {
    await this.getDatesForCareTaker();
    await this.getAvgRating();
    await this.getAllService();
    await this.getMyService();
    // await this.getWorkDates();
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
    }
  });

  // SERVICE FUNCTIONS
  updateSelectedService = ((event) => {
    this.setState({ selectedService: event.target.value });
  });

  getAllService = (async () => {
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAllService',
      });
      if (response.status === 200) {
        const serviceOptions = response.data.rows;
        this.setState({ serviceOptions: serviceOptions, selectedService: serviceOptions[0] });
      }
    } catch (err) {
      console.error("Unable to get Services. Error: " + err.response.data)
    }
  });

  addService = (async () => {
    const { userId, selectedService } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'addService',
        email: userId,
        service: selectedService,
      });
      if (response.status === 200) {
        const nextServices = response.data.rows;
        this.setState({ services: nextServices });
        console.log("New User's services:", nextServices);
      }
    } catch (err) {
      console.error("Unable to add User's service. Error: " + err.response.data)
    }
  });

  // Get services that the current care taker is providing
  getMyService = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getMyService',
        email: userId
      });
      if (response.status === 200) {
        const services = response.data.rows;
        this.setState({ services: services });
      }
    } catch (err) {
      console.error("Unable to get User's services. Error: " + err.response.data)
    }
  });

  // Remove a service from care taker.
  // key is the index of the service to remove in "this.state.services"
  removeService = (async (key) => {
    const { userId, services } = this.state;
    if (services.length  === 0) {
      return;
    }
    const serviceToRemove = services[key].serviceid;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'removeService',
        email: userId,
        service: serviceToRemove,
      });
      if (response.status === 200) {
        const nextMyServices = response.data.rows;
        this.setState({ services: nextMyServices });
        console.log("New User's services:", nextMyServices);
      }
    } catch (err) {
      console.error("Unable to remove User's service. Error: " + err.response.data)
    }
  });

  // getReviews: get all confirmed bids 
  // ( input: email output: [review, rating, byuser, timestamp]), 
  getReviews = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/review', {
        post: 'getReviews',
        email: userId,
      });
      if (response.status === 200) {
        const reviews = response.data.reviews;
        this.setState({ reviews: reviews });
        console.log("getWorkDates:", reviews);
      }
    } catch (err) {
      console.error("Unable to get Reviews. Error: " + err.response.data)
    }
  });

  //Done
  // getWorkDates: get all confirmed bids 
  // ( input: email output: [DateOfService, petownerEmail, price]), 
  getWorkDates = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getWorkDates',
        email: userId,
      });
      if (response.status === 200) {
        const workDates = response.data.rows;
        this.setState({ workDates: workDates });
        console.log("getWorkDates:", workDates);
      }
    } catch (err) {
      console.error("Unable to get Work Dates. Error: " + err.response.data)
    }
  });

  // getBids: get all available bid dates and current highest bid
  // ( input: email output: [dates, email, current highest bid]), 
  getBids = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getBids',
        email: userId,
      });
      if (response.status === 200) {
        const bids = response.data.bids;
        this.setState({ bids: bids });
        console.log("getBids:", bids);
      }
    } catch (err) {
      console.error("Unable to get Bids. Error: " + err.response.data)
    }
  });

  // acceptBid: accept current highest bid of a specific day
  // ( input: caretakerEmail, dateOfService output: [DateOfService, petownerEmail, price])
  acceptBid = (async () => {
    const { userId, bid } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'acceptBid',
        email: userId,
        bid: bid,
      });
      if (response.status === 200) {
        const workDates = response.data.bids;
        this.setState({ workDates: workDates });
        console.log("acceptBid:", workDates);
      }
    } catch (err) {
      console.error("Unable to get accept Bid. Error: " + err.response.data)
    }
  });

  // Make API call to fetch dates
  getDatesForCareTaker = (async () => {
    let availabilities = []
    try {
      // ( input: email output: [{startdate, enddate, price}]) 
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAvailability',
        email: this.state.userId,
      });
      if (response.status === 200) {
        availabilities = response.data.rows;
        console.log("getAvailabilities:", availabilities);
        if (availabilities && availabilities.length > 0) {
          // TODO Marx: transform into readable format
        }
      }
    } catch (err) {
      console.error("Unable to get Availabilities. Error: " + err.response.data)
      message.warn("Unable to get Availabilities.");
    }

    // for (let i = 0; i < availabilities.length; i++) {
    //   const range = availabilities[i];
    //   const yyyymm = range.startdate.slice(0, 8);
    //   const startDay = parseInt(range.startdate.split('-')[2]);
    //   const endDay = parseInt(range.enddate.split('-')[2]);

    //   for (let j = startDay; j <= endDay; j++) {
    //     if (j < 10) {
    //       availabilitiesStub.push(`${yyyymm}0${j}`);
    //     } else {
    //       availabilitiesStub.push(`${yyyymm}${j}`);
    //     }
    //   }
    // }
  });

  // ( input: startdate, enddate, minAutoAcceptPrice, email output: startdate, enddate(?))
  // Add new availabilities, no duplicates and sort from earliest to latest 
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
        availabilities = response.data.rows;
        this.setState({ availabilities });
        console.log("addAvailability:", availabilities);
      }
    } catch (err) {
      console.error("Unable to set Availabilities. Error: " + err.response.data)
      message.warn("Unable to add Availabilities", newAvailability);
    }

    // Transform start and end dates to be day by day
    let newAvailabilities = [];

    // TODO: Assumes all availbility range are in the same month
    for (let i = 0; i < availabilities.length; i++) {
      const range = availabilities[i];
      const yyyymm = range.startdate.slice(0, 8);
      const startDay = parseInt(range.startdate.split('-')[2]);
      const endDay = parseInt(range.enddate.split('-')[2]);

      for (let j = startDay; j <= endDay; j++) {
        if (j < 10) {
          newAvailabilities.push(`${yyyymm}0${j}`);
        } else {
          newAvailabilities.push(`${yyyymm}${j}`);
        }
      }
    }

    // Remove Duplicates
    newAvailabilities = newAvailabilities.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    // Sort in order of Dates
    newAvailabilities.sort((a, b) => {
      if (!a || !b) { return; }
      // Turn your strings into dates, and then s ubtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a) - new Date(b);
    });
    this.setState({
      availabilities: newAvailabilities,
    })

    // TODO: @chiasin. Refresh availbilities.
    // await this.getDatesForCareTaker();
  });

  //removeAvailabilities: remove availabilities 
  //(input: email, {date(yyyy-mm-dd format)} output: {startdate, enddate, price})
  removeAvailabilities = (async (date) => {
    const { userId } = this.state;
    let availabilities = []
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'removeAvailabilities',
        email: userId,
        date,
      });
      if (response.status === 200) {
        availabilities = response.data.rows;
        this.setState({ availabilities });
        console.log("removeAvailabilities:", availabilities);
      }
    } catch (err) {
      console.error("Unable to remove Availabilities. Error: " + err.response.data)
      message.warn("Unable to remove Availability", date);
    }

    // Transform start and end dates to be day by day
    let newAvailabilities = [];

    // TODO: Assumes all availbility range are in the same month
    for (let i = 0; i < availabilities.length; i++) {
      const range = availabilities[i];
      const yyyymm = range.startdate.slice(0, 8);
      const startDay = parseInt(range.startdate.split('-')[2]);
      const endDay = parseInt(range.enddate.split('-')[2]);

      for (let j = startDay; j <= endDay; j++) {
        if (j < 10) {
          newAvailabilities.push(`${yyyymm}0${j}`);
        } else {
          newAvailabilities.push(`${yyyymm}${j}`);
        }
      }
    }

    // Remove Duplicates
    newAvailabilities = newAvailabilities.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    // Sort in order of Dates
    newAvailabilities.sort((a, b) => {
      if (!a || !b) { return; }
      // Turn your strings into dates, and then s ubtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a) - new Date(b);
    });
    this.setState({
      availabilities: newAvailabilities,
    })
  });

  // Called when the calendar gets updated
  changeDate = ((startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
    });
  });

  render() {
    const { reviews, serviceOptions } = this.state;
    const services = [{ serviceid: 'Pet Walking' }, { serviceid: 'Pet something' }]; // MOCK data. @chiasin. Since the user does not have any service.
    return (
      < Tabs type="card">

        {/* Adding availabilities */}
        <TabPane tab="Profile" key="1">
          <div className="w-100 d-flex">
            <section className="col-6">
              <h3>Add your availabilities here</h3>
              <DateSection changeDate={this.changeDate} title={""} />
              <InputNumber
                defaultValue={this.state.autoAcceptedPrice}
                className={"w-100"}
                size={'large'}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.updateAutoAcceptedPrice}
              />
              <Button className="mt-4" onClick={this.setAvailabilityForCareTaker}>Add new Availability</Button>
            </section>
            <section className="col-6">
              <h3>List of Availabilities</h3>
              <List
                dataSource={this.state.availabilities}
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

        {/* Reviews of care taker */}
        <TabPane tab="Your Reviews" key="3">
          <div className="w-100 d-flex">
            <List
              bordered
              dataSource={reviews}
              renderItem={((review) => {
                return (
                  <List.Item>
                    <div className="w-100">
                      <span>{review}</span>
                    </div>
                  </List.Item>
                )
              })}
            />
          </div>
        </TabPane>
      </Tabs>
    )
  }
}

export default CareTakerView;