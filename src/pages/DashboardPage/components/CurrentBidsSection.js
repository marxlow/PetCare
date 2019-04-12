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
      highestamount: 0,
      bid: 0
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
        petownerEmail: userId,
      });
      if (response.status === 200) {
        const bids = response.data;
        this.setState({ bids: bids, highestamount: bids.highestamount, bid: bids.bid });
        console.log("getCurrentBids:", bids);
      }
    } catch (err) {
      console.error("Unable to get Bids. Error: " + err.response.data)
      message.warn("Unable to get Bids");
    }
  });

  // Called before updating bid
  openModal(bidObj) {
    this.setState({ highestamount: bidObj.highestamount, selectedBid: bidObj, showModal: true });
  }

  // Add bids and return the updated bids the current pet owners has which are not accepted or outbidded
  updateBid = (async () => {
    const { userId, newamount, bid } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/search', {
        post: 'updateBid',
        bid: bid,
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
    const { showModal, reviewMessage, careTakerEmail, bids, highestamount } = this.state;

    return (
      <div className="w-100">
        <List
          bordered
          dataSource={bids}
          renderItem={((item) => {
            return (
              <List.Item>
                <div className="d-flex w-100 justify-content-between">
                  <span>{`Date: ${item.dateofservice}`}</span>
                  <span>{`My Bid Amt: $${item.bidamount}`}</span>
                  <span>{`Taker: ${item.name}`}</span>
                  <span>{`Taker Amt: $${item.highestamount}`}</span>
                  <Button icon="submit" onClick={() => this.openModal(item)}>Update Bid</Button>
                </div>
              </List.Item>
            )
          })}
        />
        {/* Modal to add Bid */}
        <Modal
          title={`Update Bid Amount:`}
          visible={showModal}
          onOk={this.updateBid}
          onCancel={this.handleCancel}
        >
          <span>You need to bid higher than Current Highest Bid of <b>${this.state.highestamount}</b>.</span>
          <br></br>
          <br></br>
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