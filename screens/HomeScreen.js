import React, { Component } from 'react';
import {StyleSheet,Text,ImageBackground,} from 'react-native';

import { MonoText } from '../components/StyledText';


export default class HomeScreen extends Component {
  render(){
    return (
        <ImageBackground source={require('../assets/images/background-home.png')} style={{width: '100%', height: '100%'}} /> 
    );
  }
}
 
HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  
  
});
