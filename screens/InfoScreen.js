import React from "react";
import { ExpoConfigView } from "@expo/samples";
import {
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  SafeAreaView
} from "react-native";

export default function InfoScreen() {
  return (
    <>
      <SafeAreaView>
        <View>
          <Text>Teste</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

InfoScreen.navigationOptions = {
  header: null
};
