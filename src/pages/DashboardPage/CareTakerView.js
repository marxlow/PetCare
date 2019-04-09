import React, { Component } from 'react';
import { Button, List } from 'antd';
import axios from 'axios';
import DateSection from './components/DateSection';


class CareTakerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      availabilities: [],
      startDate: '',
      endDate: '',
      minAutoAcceptPrice: 99999999,
    }
  }

  // When component is loaded. Fetch all availbilities for care taker
  async componentDidMount() {
    await this.getDatesForCareTaker();
  }

// //caretaker route request types: 
// getAvailability:previously added availabilities
// ( input: email output: [{startdate, enddate, price}]) , 
// getWorkDates: get all confirmed bids 
// ( input: email output: DateOfService, petownerEmail, price), 
// addAvailability: add avail
// ( input: startdate, enddate, minAutoAcceptPrice, email output: startdate, enddate(?))
// getAllService: get all available types service
// ( input: nothing(?) output: all services)
// getMyService: get my provided service
// ( input: email output: all provided service(?)
// addService: add service
// ( input: array of services(?) output: all provided service(?), 
// removeService: remove service 
// ( input: array of services(?) output: all provided service(?)), 
// getBids: get all available bid dates and current highest bid
// ( input: email output: dates, current highest bid), 
// acceptBid: accept current highest bid of a specific day
// ( input: caretakerEmail, dateOfService output: petownerEmail, dateOfService, Price?)

  // Make API call to fetch dates
  getDatesForCareTaker = (async () => {
    // TODO: @chiasin. Make API call for all availabilities
    // let response = {}
    // try {
    //   response = await axios.get('http://localhost:3030/', {
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

    console.log("Unsorted:", newAvailabilities)

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

    console.log("Sorted:", this.state.availabilities)

    //TODO: @chiasin. Make API call to set avilability.
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