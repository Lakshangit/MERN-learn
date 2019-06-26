import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./Utils/SetAuthToken";
import { setCurrentUser, logoutUser } from "./Actions/AuthActions";

// redux
import { Provider } from "react-redux";
import store from "./store";

import AppNavbar from './component/layout/AppNavbar';
import Landing from './component/layout/Landing';
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import PrivateRoute from "./component/private-route/PrivateRoute";
import Dashboard from "./component/dashboard/Dashboard";

import './App.css';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {  
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App"> 
            <AppNavbar /> 
  
            <Route exact path="/" component={Landing} />  
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>

    );
  }
}

export default App;
