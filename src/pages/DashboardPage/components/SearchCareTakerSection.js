import React, { Component } from 'react';
import {Slider, Button, List, Card, Divider, InputNumber, DatePicker, message} from 'antd';
import axios from "axios";

const ListItem = List.Item;

class SearchCareTakerSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: this.props.userId,
      rating: 5,
      bidamount: 0,
      date: '',
      serviceid: 'No Service',
      caretakers: [], //{"email":"ct2@hotmail.com","name":"Jack","bidamount":"999.00","avgrating":"1.00"}
      serviceOptions: [],
    }
  }

  updateSearchRating = ((value) => {
    this.setState({ rating: value });
  })

  updateBidAmount = ((value) => {
    this.setState({ bidamount: value });
  })

  updateStartDate = ((date) => {
    this.setState({ date });
  })

  updateSelectedService = ((event) => {
    this.setState({ serviceid: event.target.value });
  });

  async componentDidMount() {
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getAllService',
      });
      if (response.status === 200) {
        const serviceOptions = response.data;
        this.setState({ serviceOptions: serviceOptions, serviceid: serviceOptions[0].serviceid });
      }
    } catch (err) {
      console.error("Unable to get Services. Error: " + err.response.data)
      message.warn("Unable to get all Service options");
    }

  }

  // Updates the bids for the selected caretaker
  updateConfirmBidAmt = ((value, caretakerEmail) => {
    console.log("updateConfirmBidAmt:", value, caretakerEmail);
    const { caretakers } = this.state;
    const newCaretakers = Object.assign([], caretakers);
    for (var i=0; i<newCaretakers.length; i++){
      if (newCaretakers[i].email === caretakerEmail){
        newCaretakers[i].bidamount = value;
        break;
      }
    }
    console.log("newCaretakers", newCaretakers);
    this.setState({ caretakers: newCaretakers });
  })

  // Adding bid for search results
  addBid = (async (caretakeremail, date, key) => {
    const { email, caretakers } = this.state;
    const bidamount = caretakers[key].bidamount;
    try {
      // Fetch pets for user
      const response = await axios.post('http://localhost:3030/search/', {
        post: 'addBid',
        caretakeremail,
        petownerEmail: email,
        dateofservice: date,
        bidamount,
      });
      if (response.status === 200) {
        // const caretakers = response.data;
        // console.log('> Loaded caretakers', caretakers);
        // this.setState({ caretakers });
        message.warn("Bidding Successful");
      }
    } catch (error) {
      message.warn(`Error Adding Bid`);
    }
  });

  // search careTakers based on rating and date
  searchCaretakers = (async () => {
    const { rating, bidamount, date, serviceid } = this.state;
    try {
      // Fetch pets for user
      const response = await axios.post('http://localhost:3030/search/', {
        post: 'searchCaretakers',
        serviceid,
        rating,
        bidamount,
        dateofservice: date,
      });
      if (response.status === 200) {
        const caretakers = response.data;
        console.log('> Loaded Caretakers', caretakers);
        this.setState({ caretakers });
      }
    } catch (error) {
      message.warn(`Error while Searching for Caretakers`);
    }

  });

  render() {
    const { email, rating, caretakers, serviceOptions } = this.state;
    console.log("PetOwner email:", email, this.props.userId);
    const resultStub = [
      {
        name: "John Doe",
        bidamount: 5,
        rating: 4.5,
        email: 'Dogs'
      },
      {
        name: "John Tan",
        bidamount: 5,
        rating: 4.5,
        email: 'Dogs'
      },
      {
        name: "John Low",
        bidamount: 5,
        rating: 4.5,
        email: 'Dogs'
      }
    ]
    return (
      <div className="d-flex flex-column">
        {/* Search Section */}
        <section className="d-flex flex-column mt-2">
          <div className="col-5 d-flex flex-column">
            <span>Rating</span>
            <Slider defaultValue={rating} max={5} min={1} onChange={this.updateSearchRating} />
          </div>
          <div className="col-5 d-flex flex-column mt-2">
            <span>Bid Amount</span>
            <InputNumber
                defaultValue={0}
                className={"w-100"}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.updateBidAmount}
            />
          </div>
          <div className="col-5 d-flex flex-column mt-2">
            <span>Start Date</span>
            <div>
              <DatePicker onChange={this.updateStartDate} placeHolder="Choose a date" />
            </div>
          </div>
          <div className="col-5 d-flex flex-column mt-2">
            <span>Services</span>
            <select id="inputState" className="form-control" onChange={this.updateSelectedService}>
              {serviceOptions.map((service, key) => (
                  <option key={key} value={service.serviceid}>{service.serviceid}</option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Button className="col-3 mt-2" type="primary" htmlType="submit" onClick={this.searchCaretakers}>Search</Button>
          </div>
        </section>
        <Divider />
        
        {/* Results Section */}
        <section className="d-flex flex-wrap mt-4">
          <List
            grid={{
              gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3,
            }}
            dataSource={caretakers}
            renderItem={(item, key) => (
              <ListItem>
                <Card
                  hoverable={true}
                  title={item.name}
                >
                  Email: {item.email}<br />
                  Rating: {item.avgrating}<br />
                </Card>
                <InputNumber
                  defaultValue={item.bidamount}
                  className={"w-100"}
                  size={'large'}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={(value) => this.updateConfirmBidAmt(value, item.email)}
                />
                <Button className={"w-100"} onClick={() => this.addBid(item.email, item.dateofservice, key)} >Confirm Bid</Button>
              </ListItem>
            )}
          />
          <small id="bidHelp" className="form-text text-muted">
          Bid Amount will be deducted from wallet. It will be refunded if you are outbidded.</small>
        </section>
      </div>
    )
  }
}

export default SearchCareTakerSection;