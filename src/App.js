import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from 'shared/routes/PrivateRoute';
import LoginPage from 'pages/LoginPage';
import DashboardPage from 'pages/DashboardPage';
import RegisterPage from 'pages/RegisterPage';
import AboutPage from 'pages/AboutPage';
import axios from 'axios';

import './app.css';
import 'antd/dist/antd.css';

class App extends Component {

  testFunction = (async() => {
    const response = await axios.get('http://localhost:3030/');
    console.log('> response:', response);
  });

  render() {
    this.testFunction();
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            {/* Public Pages */}
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/register" component={RegisterPage} />


            {/* Private Pages */}
            <PrivateRoute exact path="/" component={DashboardPage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
