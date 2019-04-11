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
      caretakers: [],
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

  addBid = (async (caretakeremail, date, amount) => {
    const { email } = this.state;
    try {
      // Fetch pets for user
      const response = await axios.post('http://localhost:3030/search/', {
        post: 'getAllCaretakers',
        email,
        date,
        bidamount: amount,
        caretakeremail
      });
      if (response.status === 200) {
        const caretakers = response.data;
        console.log('> Loaded caretakers', caretakers);
        this.setState({ caretakers });
      }
    } catch (error) {
      message.warn(`Error Adding Bid`);
    }
  });

  // Get all careTakers based on rating and date
  getAllCareTakers = (async () => {
    const { email, rating, bidamount, date } = this.state;
    try {
      // Fetch pets for user
      const response = await axios.post('http://localhost:3030/search/', {
        post: 'getAllCaretakers',
        email,
        rating,
        bidamount,
        date,
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
    const { rating, bidamount } = this.state;
    const resultStub = [
      {
        name: "John Doe",
        bidamount: 5,
        rating: 4.5,
        specialty: 'Dogs'
      },
      {
        name: "John Tan",
        bidamount: 5,
        rating: 4.5,
        specialty: 'Dogs'
      },
      {
        name: "John Low",
        bidamount: 5,
        rating: 4.5,
        specialty: 'Dogs'
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
          <div className="col-5 d-flex flex-column mt-3">
            <span>Start Date</span>
            <div>
              <DatePicker onChange={this.updateStartDate} placeHolder="Choose a date" />
            </div>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Button className="col-3 mt-2" type="primary" htmlType="submit" onClick={this.getAllCareTakers}>Search</Button>
          </div>
        </section>
        <Divider />
        
        {/* Results Section */}
        <section className="d-flex flex-wrap mt-4">
          <List
            grid={{
              gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3,
            }}
            dataSource={resultStub}
            renderItem={item => (
              <ListItem>
                <Card
                  hoverable={true}
                  title={item.name}
                >
                  Specialty: {item.specialty}<br />
                  Rating: {item.rating}<br />
                  Experience: {item.bidamount}<br />
                </Card>
                <InputNumber
                  defaultValue={1000}
                  className={"w-100"}
                  size={'large'}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={(value) => this.updateConfirmBidAmt(value, item.email)}
                />
                <Button className={"w-100"} onClick={() => this.addBid(item.email, item.dateofservice)} >Confirm Bid</Button>
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