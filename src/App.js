import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from 'shared/routes/PrivateRoute';
import LoginPage from 'pages/LoginPage';
import DashboardPage from 'pages/DashboardPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            {/* Public Pages */}
            <Route exact path="/login" component={LoginPage} />

            {/* Private Pages */}
            <PrivateRoute exact path="/" component={DashboardPage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
