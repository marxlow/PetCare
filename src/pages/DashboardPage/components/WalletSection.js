// Wallet panel for both Care Takers and Pet Owners
import React, { Component } from 'react';
import { Icon, Divider, Button, InputNumber, message } from 'antd';

class WalletSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amountToChange: 0, // Only positive integers
    }
  }

  updateAmountToChange = ((value) => {
    if (value < 0) {
      message.warn('Cannot go below 0');
      return;
    }
    this.setState({ amountToChange: value });
  });

  render() {
    const { amountToChange } = this.state;
    const { walletAmt, withdrawFromWallet, depositToWallet } = this.props;
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
            <Button className="mr-4" onClick={(() => withdrawFromWallet(amountToChange))}>Withdraw</Button>
            {this.props.hasDeposit ?
              <Button onClick={(() => depositToWallet(amountToChange))}>Deposit</Button>
              : null
            }
          </div>
        </section>
      </div>
    )
  }
}

export default WalletSection;
