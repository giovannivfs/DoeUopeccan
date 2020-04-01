import React, { Component } from "react";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import SwitchSelector from "react-native-switch-selector";
import { CreditCardInput } from "react-native-input-credit-card";
import { TextInputMask } from "react-native-masked-text";
import AwesomeAlert from "react-native-awesome-alerts";
import { StackActions, NavigationActions } from "react-navigation";
import api from '../services/api'

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
    var ref = this.gerarId(16)
    var valor =  parseInt(this.state.valor.replace("R$", "").replace(".", "").replace(",", ""))
    var expiry = this.state.dados.expiry.split("/")
    var card = this.state.dados.number.replace(" ","").replace(" ","").replace(" ","").replace(" ","")
    var response = await this.pagamento(this.state.tipo,ref,valor,card,parseInt(expiry[0]),parseInt(expiry[1]),this.state.dados.cvc)

    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "Doe" })]
      })
    );
    
    return response
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

  gerarId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async pagamento(kind,reference,amount,cardNumber,month,year,cvc){
    console.log(kind.toString() + " | " + reference.toString() + " | " + amount + " | " + cardNumber.toString() + " | " + month + " | " + year + " | " + cvc.toString())
    try{
      const response = await api.post(`/desenvolvedores/v1/transactions/`,
        {
          capture: true,
          kind: kind.toString(),
          reference: reference.toString() ,
          amount: amount,
          cardNumber: cardNumber.toString(),
          expirationMonth: month,
          expirationYear: year,
          securityCode: cvc.toString(),
          softDescriptor: "Doação Uopeccan"
        })

        return true
      }
      catch(err){
        return false
      }
  }

  doar = async () => {
    this.setState({ alertaConfirmacao: false, doar: false, dados: [] });
    var response = await this.finalizar();
    if(response){
      this.props.navigation.navigate("Home", { doado: true });
      Alert.alert("Doação", "Obrigado, doação realizada com sucesso!");
    }else{
      Alert.alert("Doação", "Erro ao finalizar doação... Tente novamente");
    }
    
  };

  render() {
    const options = [
      { label: "Crédito", value: "credit" },
      { label: "Débito", value: "debit" }
    ];

    const { navigete } = this.props.navigation;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
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

          {/* <View style={{marginTop: 12, flexDirection: "row", justifyContent: "center"}}>
          <Button title="+1" type="outline"   buttonStyle={styles.btnMais} titleStyle={{color: "#B10403"}} onPress={()=>this.addUm()}/>
          <Button title="+10" type="outline"  buttonStyle={styles.btnMais} titleStyle={{color: "#B10403"}}/>
          <Button title="+50" type="outline"  buttonStyle={styles.btnMais} titleStyle={{color: "#B10403"}}/>
          <Button title="+100" type="outline" buttonStyle={styles.btnMais} titleStyle={{color: "#B10403"}}/>
        </View> */}

          <View style={{ marginTop: 25 }}>
            <CreditCardInput
              labels={{
                number: "Número Cartão",
                expiry: "Validade",
                cvc: "CVC"
              }}
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
        </ScrollView>
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
  },
  btnMais: {
    borderRadius: 25,
    width: 55,
    marginRight: 7.5,
    marginRight: 7.5,
    borderColor: "#B10403"
  }
});
