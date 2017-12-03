import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Router, Route, Schema, Animations, Scene,TabBar} from 'react-native-router-flux'

import SignIn from './Components/signin.js';
import DisplayData from './Components/displaydata.js';
import EditProfile from './Components/editprofile.js';

const Routes = () => (

  <Router hideNavBar={true}>
    <Scene key = "root">
      <Scene key = "signin" component = {SignIn} hideNavBar={true} {...this.props} initial />
      <Scene key = "displaydata" component = {DisplayData} hideNavBar={true} panHandlers={null} />
      <Scene key = "editprofile" component = {EditProfile} hideNavBar={true} panHandlers={null} />
    </Scene>
 </Router>

);

export default Routes

