import React, { Component } from 'react';
import { List, Button, Modal, Typography, Rate, Icon, message, InputNumber } from 'antd';
import axios from 'axios';

const { Paragraph } = Typography;

class CurrentBidsSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      selectedBid: '',
      bids: [],
      openModal: false,
      newamount: 0,
    };
  }

  // When component first loads, find all bids belonging to current user
  async componentDidMount() {
    const { userId } = this.state;
    // Get bids the current pet owners has which are not accepted or outbidded
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'getPetOwnerBids',
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
  }

  // Called before updating bid
  openModal(bidObj) {
    this.setState({ selectedBid: bidObj, showModal: true });
  }

  // Add bids and return the updated bids the current pet owners has which are not accepted or outbidded
  updateBid = (async (bid, event) => {
    //bid = {"bid":1,"dateofservice":"2018-12-31T16:00:00.000Z","bidderemail":"po@hotmail.com","bidamount":100}
    const { userId, newamount } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/caretaker', {
        post: 'updateBid',
        email: bid.careTaker,
        bidamount: newamount,
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
  });

  handleCancel = (() => {
    this.setState({ showModal: false });
  });

  updateBidAmount = ((value) => {
    this.setState({ newamount: value });
  });
  render() {
    const bids = [
      { price: 100, date: '2019-01-15', careTaker: 'bob', careTakerEmail: 'bob@gmail.com' },
      { price: 100, date: '2019-01-13', careTaker: 'Greg', careTakerEmail: 'greg@gmail.com' },
    ]
    const { showModal, reviewMessage, careTakerEmail } = this.state;

    return (
      <div className="w-100">
        <List
          bordered
          dataSource={bids}
          renderItem={((item) => {
            return (
              <List.Item>
                <div className="d-flex w-100 justify-content-between">
                  <span>{`Date: ${item.date} | Price: ${item.price} | Taker: ${item.careTaker}`}</span>
                  <Button icon="submit" onClick={() => this.openModal(item)}>Update Bid</Button>
                </div>
              </List.Item>
            )
          })}
        />
        <Modal
          title={`Care-taker Review: ${careTakerEmail}`}
          visible={showModal}
          onOk={this.updateBid}
          onCancel={this.handleCancel}
        >
        <InputNumber
                  defaultValue={0}
                  className={"w-100"}
                  size={'large'}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={this.updateBidAmount}
                />
        </Modal>
      </div >
    )
  }
}

export default CurrentBidsSection;