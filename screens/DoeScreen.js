import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { Input } from "react-native-elements";
import SwitchSelector from "react-native-switch-selector";
import {
  CreditCardInput,
  LiteCreditCardInput
} from "react-native-input-credit-card";


export default class DoeScreen extends Component {

  state = {
    dados: {},
    valid: false,
    type: "credit"
  }



  _onChange = (formData) => {
    this.setState({dados: formData.values, valid: formData.valid})
  } 

  render() {
    const options = [
      { label: "Crédito", value: "credit" },
      { label: "Débito", value: "debit" }
    ];

    return (
      <SafeAreaView style={styles.container}>
        <SwitchSelector
          options={options}
          buttonColor="#B10403"
          borderColor="#B10403"
          buttonMargin={3}
          hasPadding
          initial={0}
          onPress={value => this.setState({type: value})}
        />
        <View style={{ marginTop: 20 }}>
          <CreditCardInput
            labels={{ number: "Número Cartão", expiry: "Validade", cvc: "CVC" }}
            placeholders={{
              number: "1234 5678 1234 5678",
              expiry: "MM/AA",
              cvc: "CVC"
            }}
            allowScroll
            onChange={this._onChange}
          />
        </View>
      </SafeAreaView>
    );
  }
}

DoeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 10
  }
});
