import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import DoeScreen from '../screens/DoeScreen';
import InfoScreen from '../screens/InfoScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
  
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Início',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: '#B10403',
  }
};

HomeStack.path = '';

const DoeStack = createStackNavigator(
  {
    Doe: DoeScreen,
  },
  config
);

DoeStack.navigationOptions = {
  tabBarLabel: 'Doe',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'} />
  ),
  tabBarOptions: {
    activeTintColor: '#B10403',
  }
};

DoeStack.path = '';

const InfoStack = createStackNavigator(
  {
    Info: InfoScreen,
  },
  config
);

InfoStack.navigationOptions = {
  tabBarLabel: 'Info',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'} />
  ),
  tabBarOptions: {
    activeTintColor: '#B10403',
  }
};

InfoStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  DoeStack,
  InfoStack,
});

tabNavigator.path = '';

export default tabNavigator;
