import React, { Component } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import SwitchSelector from "react-native-switch-selector";
import { CreditCardInput } from "react-native-input-credit-card";
import { TextInputMask } from "react-native-masked-text";
import AwesomeAlert from "react-native-awesome-alerts";
import { StackActions, NavigationActions } from "react-navigation";

console.disableYellowBox = true;

export default class DoeScreen extends Component {
  state = {
    dados: {},
    valido: false,
    tipo: "credit",
    valor: "0.00",
    alertaConfirmacao: false,
    alertaTitulo: "",
    alertaTexto: "",
    alertaBtnOk: true,
    alertaBtnOkTexto: "Ok",
    alertaBtnNok: false,
    doar: false
  };

  alteraCartao = formData => {
    this.setState({ dados: formData.values, valido: formData.valid });
    this.state.valido;
  };

  alteraValor(valor) {
    this.setState({ valor });
  }

  finalizar = async () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "Doe" })]
      })
    );
  };

  validar() {
    if (
      parseInt(
        this.state.valor
          .replace("R$", "")
          .replace(".", "")
          .replace(",", "")
      ) === 0
    ) {
      this.setState({
        alertaConfirmacao: true,
        alertaTitulo: "Atenção",
        alertaTexto: "O valor para doação deve ser maior que R$ 0,00",
        doar: false
      });
    } else if (this.state.valido === false) {
      this.setState({
        alertaConfirmacao: true,
        alertaTitulo: "Atenção",
        alertaTexto: "Dados do cartão inválidos favor tente novamente",
        doar: false
      });
    } else {
      this.setState({
        alertaConfirmacao: true,
        alertaTitulo: "Doação",
        alertaTexto: "Confirmar doação?",
        alertaBtnNok: true,
        alertaBtnOkTexto: "Confirmar",
        doar: true
      });
    }
  }

  doar = async () => {
    this.setState({ alertaConfirmacao: false, doar: false, dados: [] });
    await this.finalizar();
    this.props.navigation.navigate("Home", { doado: true });
    Alert.alert("Doação", "Obrigado por realizar a doação");
  };

  render() {
    const options = [
      { label: "Crédito", value: "credit" },
      { label: "Débito", value: "debit" }
    ];

    const { navigete } = this.props.navigation;

    return (
      <SafeAreaView style={styles.container}>
        <SwitchSelector
          style={{ marginBottom: 25 }}
          options={options}
          buttonColor="#B10403"
          borderColor="#B10403"
          buttonMargin={3}
          hasPadding
          initial={0}
          onPress={value => this.setState({ type: value })}
        />
        <View style={styles.containerRow}>
          <TextInputMask
            type={"money"}
            options={{
              precision: 2,
              separator: ",",
              delimiter: ".",
              unit: "R$",
              suffixUnit: ""
            }}
            value={this.state.valor}
            onChangeText={text => this.alteraValor(text)}
            style={styles.maskInput}
          />
        </View>

        <View style={{ marginTop: 25 }}>
          <CreditCardInput
            labels={{ number: "Número Cartão", expiry: "Validade", cvc: "CVC" }}
            placeholders={{
              number: "1234 5678 1234 5678",
              expiry: "MM/AA",
              cvc: "CVC"
            }}
            allowScroll
            onChange={this.alteraCartao}
          />
        </View>
        <Button
          buttonStyle={{ backgroundColor: "#B10403" }}
          icon={<Icon name="hand-holding-heart" size={15} color="white" />}
          title=" Doar"
          onPress={() => this.validar()}
        />

        <AwesomeAlert
          show={this.state.alertaConfirmacao}
          showProgress={false}
          title={this.state.alertaTitulo}
          message={this.state.alertaTexto}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={this.state.alertaBtnNok}
          showConfirmButton={this.state.alertaBtnOk}
          cancelText="Cancelar"
          cancelButtonColor="#B10403"
          confirmText={this.state.alertaBtnOkTexto}
          confirmButtonColor="#0e8a00"
          onCancelPressed={() => {
            this.setState({ alertaConfirmacao: false });
          }}
          onConfirmPressed={() => {
            this.state.doar
              ? this.doar()
              : this.setState({ alertaConfirmacao: false });
          }}
        />
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
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "center"
  },
  maskInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontSize: 50,
    textAlign: "center",
    width: 280
  }
});
