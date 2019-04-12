import React, { Component } from 'react';
import { List, Button, Modal, message, InputNumber, Divider } from 'antd';
import axios from 'axios';

class CurrentBidsSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      selectedBid: '',
      confirmedBids: [],
      openModal: false,
      newAmount: 0,
      bids: this.props.bids,
      highestamount: this.props.highestamount,
      bid: this.props.bid,
    };
  }

  // When component first loads, find all bids belonging to current user
  async componentDidMount() {
    await this.getFutureCompletedServices();
  }

  UNSAFE_componentWillReceiveProps() {
    this.forceUpdate();
  }
  
  // Get bids that are won by the pet owner and are in the future
  getFutureCompletedServices = (async () => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/search', {
        post: 'getFutureCompletedServices',
        petownerEmail: userId,
      });
      if (response.status === 200) {
        const confirmedBids = response.data;
        this.setState({ confirmedBids });
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
  addBid = (async () => {
    const { userId, selectedBid, newAmount } = this.state;
    const { caretakeremail, dateofservice} = selectedBid;
    try {
      const response = await axios.post('http://localhost:3030/search', {
        post: 'addBid',
        petownerEmail: userId,
        caretakeremail: caretakeremail,
        bidamount: newAmount,
        dateofservice: dateofservice,
      });
      if (response.status === 200) {
        message.success("Bidding Successful");
        await this.props.getCurrentBids();
        await this.props.updateWallet();
      }
    } catch (err) {
      console.error("Unable to Bid. Error: " + err.response.data)
      message.warn("Unable to Bid");
    }
    this.setState({ showModal: false });
  });

  handleCancel = (() => {
    this.setState({ showModal: false });
  });

  updateBidAmount = ((value) => {
    this.setState({ newAmount: value });
  });

  render() {
    const { showModal, bids, confirmedBids } = this.state;
    return (
      <div className="w-100">
        <h3>Confirmed Future Bids</h3>
        <List
          bordered
          dataSource={confirmedBids}
          renderItem={((item) => {
            return (
              <List.Item>
                <div className="d-flex w-100 justify-content-between">
                  <span>{`Date: ${item.dateofservice}`}</span>
                  <span>{`My Winning Bid: $${item.bidamount}`}</span>
                  <span>{`CareTaker: ${item.caretakername}`}</span>
                </div>
              </List.Item>
            )
          })}
        />
        <Divider />
        <h3>Bids in Process</h3>
        <List
          bordered
          dataSource={bids}
          renderItem={((item) => {
            return (
              <List.Item>
                <div className="d-flex w-100 justify-content-between">
                  <span>{`Date: ${item.dateofservice}`}</span>
                  <span>{`My Bid: $${item.bidamount}`}</span>
                  <span>{`CareTaker: ${item.name}`}</span>
                  <span>{`Highest Bid: $${item.highestamount}`}</span>
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
          onOk={this.addBid}
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