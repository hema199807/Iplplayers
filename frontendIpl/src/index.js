import React from 'react';
import ReactDOM from 'react-dom';
import {  HashRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Header from './components/Header';
import AddPlayer from "./components/AddPlayer";
import ADMIN from "./components/Admin";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <HashRouter basename="/">
    
    <Switch>
    <Route path="/" exact component={App} />
    <Route path="/login" exact component={Login} />
    <Route path="/signup" exact component={SignUp} />
    <Route path="/add" exact component={AddPlayer} />
    <Route path="/admin" exact component={ADMIN} />
    </Switch>
    </HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
