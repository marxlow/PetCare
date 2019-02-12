import React, { Component } from 'react';

class SplitLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const brandPictureUrl = "https://i.stack.imgur.com/RnXFq.jpg";
    return (
      <div className="row w-100" >
        {/* Default left portion with brand */}
        < div className="col-6" >
          <img className="img-fluid vh-100" src={brandPictureUrl} alt="brand"/>
        </div>

        {/* Passed child component */}
        < div className="col-6" >
          {this.props.children}
        </div >
      </div >
    )
  }
}

export default SplitLayout;
