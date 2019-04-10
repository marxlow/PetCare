import React, { Component } from 'react';
import { Button, List, Tabs, message, InputNumber } from 'antd';
import axios from 'axios';
import DateSection from './components/DateSection';

const TabPane = Tabs.TabPane;

const myServicesStub = ['HairDressing', 'NailCare', 'PetTraining']
const allServicesStub = ['HairDressing', 'OutdoorStroll', 'NailCare', 'PetExercising', 'PetTraining']

class CareTakerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      availabilities: [],
      startDate: '',
      endDate: '',
      autoAcceptedPrice: 99999999,
      myServices: myServicesStub,
      allServices: allServicesStub,
      newService: '',
      reviews: [],
      avgRating: -2,
    }
  }

  updateAutoAcceptedPrice = ((value) => {
    this.setState({ autoAcceptedPrice: value });
  });

  // When component is loaded. Fetch all availabilities for care taker
  async componentDidMount() {
    await this.getDatesForCareTaker();
    await this.getAvgRating();
    // await this.getWorkDates();
    // await this.getAllService();
    // await this.getMyService();
  }

  //Done
  // getAvgRating: get all confirmed bids 
  // ( input: email output: [avgrating]), 
  getAvgRating = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAvgRating',
        email: userId,
      });
      if (response.status === 200) {
        const avgRating = response.data.avgrating;
        this.setState({ avgRating });
        this.props.updateAvgRating(avgRating);
      }
    } catch (err) {
      console.error("Unable to get Average Rating. Error: " + err.response.data)
      message.warn("Unable to get Average Rating");
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

  //Done
  // getAllService: get all available types service
  // ( input: nothing(?) output: all services)
  getAllService = (async () => {
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAllService',
      });
      if (response.status === 200) {
        const allServices = response.data.rows;
        this.setState({ allServices: allServices });
        console.log("All services:", allServices);
      }
    } catch (err) {
      console.error("Unable to get Services. Error: " + err.response.data)
    }
  });

  //Done
  // getMyService: get my provided service
  // ( input: email output: all provided service(?)
  getMyService = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getMyService',
        email: userId
      });
      if (response.status === 200) {
        const myServices = response.data.rows;
        this.setState({ myServices: myServices });
        console.log("User's services:", myServices);
      }
    } catch (err) {
      console.error("Unable to get User's services. Error: " + err.response.data)
    }
  });

  //Done Unattached
  // addService: add service
  // ( input: array of services(?) output: all provided service(?), 
  // Adds a new service to user's service from all services which user did not have
  addService = (async () => {
    const { userId, newService } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'addService',
        email: userId,
        service: newService,
      });
      if (response.status === 200) {
        const nextMyServices = response.data.rows;
        this.setState({ myServices: nextMyServices });
        console.log("New User's services:", nextMyServices);
      }
    } catch (err) {
      console.error("Unable to add User's service. Error: " + err.response.data)
    }
  });

  //Done Unattached
  // removeService: remove service 
  // ( input: array of services(?) output: all provided service(?)),
  removeService = (async (event, value) => {
    const deleted = "NailCare"
    const { userId, myServices } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'removeService',
        email: userId,
        service: deleted,
      });
      if (response.status === 200) {
        const nextMyServices = response.data.rows;
        this.setState({ myServices: nextMyServices });
        console.log("New User's services:", nextMyServices);
      }
    } catch (err) {
      console.error("Unable to remove User's service. Error: " + err.response.data)
    }
  });

  // getAvailability:previously added availabilities
  // ( input: email output: [{startdate, enddate, price}]) 
  // Make API call to fetch dates
  getDatesForCareTaker = (async () => {
    let availabilities = []
    // TODO: @chiasin. Make API call for all availabilities
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAvailability',
        email: this.state.userId,
      });
      if (response.status === 200) {
        availabilities = response.data.rows;
        console.log("getAvailabilities:", availabilities);
      }
    } catch (err) {
      console.error("Unable to get Availabilities. Error: " + err.response.data)
      message.warn("Unable to get Availabilities.");
    }

    // const availabilityRangeStub = [
    //   { startDate: '2019-04-01', endDate: '2019-04-02' },
    //   { startDate: '2019-04-05', endDate: '2019-04-10' },
    // ]

    // Transform start and end dates to be day by day
    const availabilitiesStub = [];

    // TODO: Assumes all availbility range are in the same month
    for (let i = 0; i < availabilities.length; i++) {
      const range = availabilities[i];
      const yyyymm = range.startdate.slice(0, 8);
      const startDay = parseInt(range.startdate.split('-')[2]);
      const endDay = parseInt(range.enddate.split('-')[2]);

      for (let j = startDay; j <= endDay; j++) {
        if (j < 10) {
          availabilitiesStub.push(`${yyyymm}0${j}`);
        } else {
          availabilitiesStub.push(`${yyyymm}${j}`);
        }
      }
    }

    this.setState({
      availabilities: availabilitiesStub,
    })
  });

  // addAvailability: add avail
  // ( input: startdate, enddate, minAutoAcceptPrice, email output: startdate, enddate(?))
  // Add new availabilities, no duplicates and sort from earliest to latest 
  setAvailabilityForCareTaker = (async () => {
    const { startDate, endDate, autoAcceptedPrice } = this.state;
    console.log(startDate, endDate);
    
    // // TODO: Assumes all availability range are in the same month
    // const yyyymm = startdate.slice(0, 8);
    // const startDay = parseInt(startdate.split('-')[2]);
    // const endDay = parseInt(enddate.split('-')[2]);
    
    // for (let j = startDay; j <= endDay; j++) {
    //   if (j < 10) {
    //     newAvailabilities.push(`${yyyymm}0${j}`);
    //   } else {
    //     newAvailabilities.push(`${yyyymm}${j}`);
    //   }
    // }

    //TODO: @chiasin. Make API call to set availability.
    const newAvailability = {
      post: 'addAvailability',  
      startDate,
      endDate,
      autoAcceptedPrice,
      email: this.state.userId
    }
    let availabilities = []
    try {
      const response = await axios.post('http://localhost:3030/caretaker', newAvailability);
      if (response.status === 200) {
        availabilities = response.data.rows;
        this.setState({ availabilities });
        console.log("getAvailabilities:", availabilities);
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
    newAvailabilities.sort((a,b) => {
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

  // Called when the calendar gets updated
  changeDate = ((startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
    });
  });

  render() {
    return (
      < Tabs type="card">
        {/* Adding availabilities */}
        <TabPane tab="Profile" key="1">
          <div className="w-100 d-flex">
            <section className="col-6">
              <h3>Add your availabilities here</h3>
              <DateSection changeDate={this.changeDate} title={""} />
              <InputNumber
                  defaultValue={1000}
                  className={"w-100"}
                  size={'large'}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={this.updateAutoAcceptedPrice}
                />
              <Button className="mt-4" onClick={this.setAvailabilityForCareTaker}>Add new Availability</Button>
            </section>
            <section className="col-6">
              <h3>List of availabilities</h3>
              <List
                dataSource={this.state.availabilities}
                renderItem={(item) => (<List.Item>{item}</List.Item>)}
              />
            </section>
          </div>
        </TabPane>
      </Tabs>
    )
  }
}

export default CareTakerView;