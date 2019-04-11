import React, { Component } from 'react';
import { List, Button, Modal, Typography, Rate, Icon, message, InputNumber } from 'antd';
import axios from 'axios';

const { Paragraph } = Typography;

const bidsStub = [
  {caretakeremail: 'bob@gmail.com', highestbidderemail: 'greg@gmail.com', currenttopbidamt: 150 , dateofservice: '2019-01-15' , bidtimestamp: '2019-01-15' },
  {caretakeremail: 'bod@gmail.com', highestbidderemail: 'gre@gmail.com', currenttopbidamt: 150 , dateofservice: '2019-01-15' , bidtimestamp: '2019-01-15' },
]

class CurrentBidsSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      selectedBid: '',
      bids: bidsStub, // {caretakeremail, highestBidderEmail, currentTopbidamt , dateofservice, bidtimestamp },
      openModal: false,
      newamount: 0,
    };
  }

  // When component first loads, find all bids belonging to current user
  async componentDidMount() {
    await this.getCurrentBids();
  }

  // Get bids the current pet owners has which are not accepted or outbidded
  // input : email(pet owner),
  // output : [{ caretakeremail,
  // highestBidderEmail, currentTopbidamt( status = 'current highest') ,
  // dateofservice,
  // timestampByHighest,  }]
  getCurrentBids = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/search', {
        post: 'getCurrentBids',
        email: userId,
      });
      if (response.status === 200) {
        const bids = response.data;
        this.setState({ bids: bids });
        console.log("getCurrentBids:", bids);
      }
    } catch (err) {
      console.error("Unable to get Bids. Error: " + err.response.data)
      message.warn("Unable to get Bids");
    }
  });

  // Called before updating bid
  openModal(bidObj) {
    this.setState({ selectedBid: bidObj, showModal: true });
  }

  // Add bids and return the updated bids the current pet owners has which are not accepted or outbidded
  updateBid = (async () => {
    //bid = {"bid":1,"dateofservice":"2018-12-31T16:00:00.000Z","bidderemail":"po@hotmail.com","bidamount":100}
    const { userId, newamount, selectedBid } = this.state;
    const { caretakeremail, dateofservice } = selectedBid;
    try {
      const response = await axios.post('http://localhost:3030/search', {
        post: 'addBid',
        caretakeremail,
        petownerEmail: userId,
        dateofservice,
        bidamount: newamount,
      });
      if (response.status === 200) {
        message.warn("Bidding Successful");
      }
    } catch (err) {
      console.error("Unable to Bid. Error: " + err.response.data)
      message.warn("Unable to Bid");
    }
    await this.getCurrentBids();
  });

  handleCancel = (() => {
    this.setState({ showModal: false });
  });

  updateBidAmount = ((value) => {
    this.setState({ newamount: value });
  });
  render() {
    const { showModal, selectedBid, bids } = this.state;

    return (
      <div className="w-100">
        <List
          bordered
          dataSource={bids}
          renderItem={((item) => {
            return (
              <List.Item>
                <div className="d-flex w-100 justify-content-between">
                  <span>{`Date: ${item.dateofservice} | Top Bid: ${item.currenttopbidamt} | Taker: ${item.highestbidderemail} | Timestamp: ${item.bidtimestamp}`}</span>
                  <Button icon="submit" onClick={() => this.openModal(item)}>Update Bid</Button>
                </div>
              </List.Item>
            )
          })}
        />
        <Modal
          title={`Bid: ${selectedBid.currenttopbidamt}`}
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