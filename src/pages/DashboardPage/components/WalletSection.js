// Wallet panel for both Care Takers and Pet Owners
import React, { Component } from 'react';
import { Icon, Divider, Button, InputNumber, message } from 'antd';
import axios from 'axios';

class WalletSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletAmt: Number(this.props.walletAmt),
      userId: this.props.userId,
      amountToChange: 0, // Only positive integers
    }
  }

  updateAmountToChange = ((value) => {
    this.setState({ amountToChange: value });
  });

  withdrawFromWallet = (async () => {
    const { userId, walletAmt, amountToChange } = this.state;
    const updatedWalletAmt = walletAmt - amountToChange;

    // Guard against withdrawal amounts greater than wallet amount.
    if (updatedWalletAmt < 0) {
      message.warn(`You only have: $${walletAmt} in your wallet!`);
      return;
    }

    // Make actual withdrawal
    try {
      const response = await axios.post('http://localhost:3030/wallet', {
        email: userId,
        amt: updatedWalletAmt,
        post: 'updateWallet',
      });
      if (response.status === 200) {
        message.success("Successfully withdrawn from wallet");
        this.setState({ walletAmt: updatedWalletAmt });
      }
    } catch (error) {
      console.warn(error.message);
      message.warn('Error. Please try again later');
    }

  });

  depositFromWallet = (async () => {
    const { userId, walletAmt, amountToChange } = this.state;
    const updatedWalletAmt = walletAmt + amountToChange;
    
    // Make actual withdrawal
    try {
      const response = await axios.post('http://localhost:3030/wallet', {
        email: userId,
        amt: updatedWalletAmt,
        post: 'updateWallet',
      });
      console.log(response);
      if (response.status === 200) {
        message.success("Successfully deposited to wallet");
        this.setState({ walletAmt: updatedWalletAmt });
      }
    } catch (error) {
      console.warn(error.message);
      message.warn('Error. Please try again later');
    }
  });

  render() {
    const { walletAmt } = this.state;
    return (
      <div className="d-flex flex-column w-100">
        {/* Display Wallet section */}
        <section>
          <Icon className="fs-4" type="wallet" />
          <span className="ml-4 h-1">You have {`$${walletAmt}`} in your wallet</span>
        </section>
        <Divider />

        {/* Withdraw / Deposit section */}
        <section className="d-flex flex-column">
          <span className="h-1">Update your wallet here!</span>
          <div className="mt-4">
            <InputNumber
              className="mr-4"
              defaultValue={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={this.updateAmountToChange}
            />
            <Button className="mr-4" onClick={this.withdrawFromWallet}>Withdraw</Button>
            <Button onClick={this.depositFromWallet}>Deposit</Button>
          </div>
        </section>
      </div>
    )
  }
}

export default WalletSection;