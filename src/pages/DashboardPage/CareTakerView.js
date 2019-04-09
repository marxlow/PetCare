import React, { Component } from 'react';
import { Button, List } from 'antd';
import axios from 'axios';
import DateSection from './components/DateSection';

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
      minAutoAcceptPrice: 99999999,
      myServices: myServicesStub,
      allServices: allServicesStub,
      newService: '',
    }
  }

  // When component is loaded. Fetch all availbilities for care taker
  async componentDidMount() {
    await this.getDatesForCareTaker();
  }

  // getWorkDates: get all confirmed bids 
  // ( input: email output: DateOfService, petownerEmail, price), 
  getWorkDates = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.get('http://localhost:3030/caretaker', {
        post: 'getWorkDates',
        email: userId,
      });
      if (response.status === 200) {
        const workDates = response.data;
        this.setState({ workDates: workDates });
        console.log("getWorkDates:", workDates);
      }
    } catch (err) {
      console.error("Unable to get Work Dates. Error: " + err.response.data)
    }
  });

  // getBids: get all available bid dates and current highest bid
  // ( input: email output: dates, email, current highest bid), 
  getBids = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.get('http://localhost:3030/caretaker', {
        post: 'getBids',
        email: userId,
      });
      if (response.status === 200) {
        const bids = response.data;
        this.setState({ bids: bids });
        console.log("getBids:", bids);
      }
    } catch (err) {
      console.error("Unable to get Bids. Error: " + err.response.data)
    }
  });

  // acceptBid: accept current highest bid of a specific day
  // ( input: caretakerEmail, dateOfService output: workDates)
  acceptBid = (async () => {
    const { userId, bid } = this.state;
    try {
      const response = await axios.get('http://localhost:3030/caretaker', {
        post: 'acceptBid',
        email: userId,
        bid: bid,
      });
      if (response.status === 200) {
        const workDates = response.data;
        this.setState({ workDates: workDates });
        console.log("acceptBid:", workDates);
      }
    } catch (err) {
      console.error("Unable to get accept Bid. Error: " + err.response.data)
    }
  });

  // getAllService: get all available types service
  // ( input: nothing(?) output: all services)
  getAllService = (async () => {
    try {
      const response = await axios.get('http://localhost:3030/caretaker', {
        post: 'getAllService',
      });
      if (response.status === 200) {
        const allServices = response.data;
        this.setState({ allServices: allServices });
        console.log("All services:", allServices);
      }
    } catch (err) {
      console.error("Unable to get Services. Error: " + err.response.data)
    }
  });

  // getMyService: get my provided service
  // ( input: email output: all provided service(?)
  getMyService = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.get('http://localhost:3030/caretaker', {
        post: 'getMyService',
        email: userId
      });
      if (response.status === 200) {
        const myServices = response.data;
        this.setState({ myServices: myServices });
        console.log("User's services:", myServices);
      }
    } catch (err) {
      console.error("Unable to get User's services. Error: " + err.response.data)
    }
  });

  // addService: add service
  // ( input: array of services(?) output: all provided service(?), 
  // Adds a new service to user's service from all services which user did not have
  addService = (async () => {
    const { userId, newService } = this.state;
    try {
      const response = await axios.get('http://localhost:3030/caretaker', {
        post: 'addService',
        email: userId,
        service: newService,
      });
      if (response.status === 200) {
        const nextMyServices = response.data;
        this.setState({ myServices: nextMyServices });
        console.log("New User's services:", nextMyServices);
      }
    } catch (err) {
      console.error("Unable to add User's service. Error: " + err.response.data)
    }
  });

  // removeService: remove service 
  // ( input: array of services(?) output: all provided service(?)),
  removeService = (async () => {
    const deleted = "NailCare"
    const { userId, myServices } = this.state;
    try {
      const response = await axios.get('http://localhost:3030/caretaker', {
        post: 'removeService',
        email: userId,
        service: deleted,
      });
      if (response.status === 200) {
        const nextMyServices = response.data;
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
    // TODO: @chiasin. Make API call for all availabilities
    // let response = {}
    // try {
    //   response = await axios.get('http://localhost:3030/caretaker', {
    //     post: 'getAvailability',
    //     email: this.state.userId,
    //   });
    // } catch (err) {
    //   console.error("Unable to get Availabilities. Error: " + err.response.data)
    // }
    // if (response.status === 200) {
    //   const { startdate, enddate, price } = response.data;
    // } else {
    //   console.error("Unable to get Availabilities. Status: " + response.status)
    // }

    const availabilityRangeStub = [
      { startDate: '2019-04-01', endDate: '2019-04-02' },
      { startDate: '2019-04-05', endDate: '2019-04-10' },
    ]

    // Transform start and end dates to be day by day
    const availabilitiesStub = [];

    // TODO: Assumes all availbility range are in the same month
    for (let i = 0; i < availabilityRangeStub.length; i++) {
      const range = availabilityRangeStub[i];
      const yyyymm = range.startDate.slice(0, 8);
      const startDay = parseInt(range.startDate.split('-')[2]);
      const endDay = parseInt(range.endDate.split('-')[2]);

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
    const { startDate, endDate, minAutoAcceptPrice, availabilities } = this.state;
    console.log(startDate, endDate);

    // Transform start and end dates to be day by day
    let newAvailabilities = Object.assign([], availabilities);
    
    // TODO: Assumes all availability range are in the same month
    const yyyymm = startDate.slice(0, 8);
    const startDay = parseInt(startDate.split('-')[2]);
    const endDay = parseInt(endDate.split('-')[2]);
    
    for (let j = startDay; j <= endDay; j++) {
      if (j < 10) {
        newAvailabilities.push(`${yyyymm}0${j}`);
      } else {
        newAvailabilities.push(`${yyyymm}${j}`);
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

    //TODO: @chiasin. Make API call to set availability.
    // let response = {};
    // try {
    //   response = await axios.post('http://localhost:3030/caretaker', {
    //     post: 'addAvailability',  
    //     startDate,
    //     endDate,
    //     minAutoAcceptPrice,
    //     email: this.state.userId
    //   });
    // } catch (err) {
    //   console.error("Unable to set Availabilities. Error: " + err.response.data)
    // }
    // if (response.status === 200) {
    //   const { startdate, enddate } = response.data;
    // } else {
    //   console.error("Unable to set Availabilities. Status: " + response.status)
    // }
    
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
      <div className="w-100 d-flex">
        <section className="col-6">
          <h3>Add your availabilities here</h3>
          <DateSection changeDate={this.changeDate} title={""} />
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
    )
  }
}

export default CareTakerView;