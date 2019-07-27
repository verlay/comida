import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import { Button } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";
import t from "tcomb-form-native";
const Form = t.form.Form;
import { RegisterStruct, RegisterOptions } from "../../forms/Register";

import * as firebase from "firebase";

export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      registerStruct: RegisterStruct,
      registerOptions: RegisterOptions,
      formData: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      },
      formErrorMessage: ""
    };
  }
  register = () => {
    const { password, passwordConfirmation } = this.state.formData;
    if (password === passwordConfirmation) {
      const validate = this.refs.registerForm.getValue();
      if (validate) {
        this.setState({ formErrorMessage: "" });
        firebase
          .auth()
          .createUserWithEmailAndPassword(validate.email, validate.password)
          .then(resolve => {
            this.refs.toast.show("Registro Correcto", 150, () => {
              this.props.navigation.goBack();
            });
          })
          .catch(err => {
            this.refs.toast.show("El Email ya esta en Uso", 2500);
          });
        //console.log("registro correcto");
      } else {
        this.setState({
          formErrorMessage: "Formulario Invalido"
        });
      }
    } else {
      this.setState({
        formErrorMessage: "Las contraseñas no son iguales"
      });
    }
  };

  onChangeFormRegister = formValue => {
    this.setState({
      formData: formValue
    });
  };

  render() {
    const { registerStruct, registerOptions, formErrorMessage } = this.state;
    return (
      <View style={styles.viewBody}>
        <Form
          ref="registerForm"
          type={registerStruct}
          options={registerOptions}
          value={this.state.formData}
          onChange={formValue => this.onChangeFormRegister(formValue)}
        />
        <Button
          buttonStyle={styles.buttonRegisterContainer}
          title="Unirme"
          onPress={() => this.register()}
        />
        <Text style={styles.formErrorMessage}>{formErrorMessage}</Text>
        <Toast
          ref="toast"
          position="bottom"
          positionValue={150}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 30,
    marginRight: 30
  },
  buttonRegisterContainer: {
    backgroundColor: "#00a680",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  formErrorMessage: {
    color: "#f00",
    textAlign: "center",
    marginTop: 30
  }
});
