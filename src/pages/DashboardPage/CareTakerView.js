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
    await this.getAllService();
    await this.getMyService();
    await this.getBids();
    await this.getWorkDates();
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

  getAllService = (async () => {
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

  // Get services that the current care taker is providing
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
        const reviews = response.data;
        this.setState({ reviews: reviews });
        console.log("getWorkDates:", reviews);
      }
    } catch (err) {
      console.error("Unable to get Reviews. Error: " + err.response.data)
      message.warn("Unable to get Reviews");
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
        const bids = response.data;
        this.setState({ bids: bids });
        console.log("getBids:", bids);
      }
    } catch (err) {
      console.error("Unable to get Bids. Error: " + err.response.data)
      message.warn("Unable to get Bids");
    }
  });

  // acceptBid: accept current highest bid of a specific day
  // ( input: caretakerEmail, bid output: [DateOfService, petownerEmail, price])
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
        availabilities = response.data;
        console.log("getAvailabilities:", availabilities);
        if (availabilities && availabilities.length > 0) {
          // TODO Marx: transform into readable format
        }
      }
    } catch (err) {
      console.error("Unable to get Availabilities. Error: " + err.response.data)
      message.warn("Unable to get Availabilities.");
    }

    let newAvailabilities = [];
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
    this.setState({ availabilities: newAvailabilities });
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
        availabilities = response.data;
        // this.setState({ availabilities });
        console.log("addAvailability:", availabilities);
      }
    } catch (err) {
      console.error("Unable to set Availabilities. Error: " + err.response.data)
      message.warn("Unable to add Availabilities", newAvailability);
      return;
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
    this.setState({ availabilities: newAvailabilities });

    // TODO: @chiasin. Refresh availbilities.
    // await this.getDatesForCareTaker();
  });

  //removeAvailabilities: remove availabilities 
  //(input: email, {date(yyyy-mm-dd format)} output: {startdate, enddate, price})
  removeAvailabilities = (async (date) => {
    console.log("Removing date:", date);
    const { userId } = this.state;
    let availabilities = []
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'removeAvailabilities',
        email: userId,
        date,
      });
      if (response.status === 200) {
        availabilities = response.data;
        this.setState({ availabilities });
        console.log("removeAvailabilities:", availabilities);
      }
    } catch (err) {
      console.error("Unable to remove Availabilities. Error: " + err.response.data)
      message.warn("Unable to remove Availability", date);
      return;
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
    const { reviews, serviceOptions, services, workDates, bids } = this.state;
    console.log("Bids:", JSON.stringify(bids));
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
          <div className="w-100 d-flex">
            <List
              bordered
              itemLayout="horizontal"
              dataSource={reviews}
              renderItem={((review) => {
                return (
                  <List.Item>
                    <div className="w-100">
                      <ListItemMeta
                        title={`${review.name} | ${review.email}`}
                        description={`${review.review} | Rating:${review.rating} | Date of Service:${review.dateofservice} | Accepted Amount: ${review.bidamount} | ${review.rid} | ${review.timestamp}`}
                      />
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
                          title={`${item.dateofservice}`}
                          description={`Pet Owner:${item.bidderemail} | Accepted Amount:${item.bidamount} | ${item.bid}`}
                        />
                    </div>
                  </List.Item>
                )
              })}
            />
          </div>
        </TabPane>

        {/* Bids */}
        <TabPane tab="Your Bids" key="5">
          <div className="w-100 d-flex">
            <section className="col-6">
              <h3>List of Bids</h3>
              <List
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
            </section>
          </div>
        </TabPane>
      </Tabs>
    )
  }
}

export default CareTakerView;