import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import Input from "../components/Input";
import Card from "../components/Card";
import { AuthContext } from "../context/AuthContext";
import { LOCAL_IP } from "../config/env";

async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (e) {
    console.log("Posting Data Failed");
    console.log(e);
  }
}

const SignInScreen = (props) => {
  const [error, setError] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const onSignInSubmit = async () => {
    try {
      const data = await postData(LOCAL_IP + "/users/login", {
        email,
        password,
      });
      context.authDispatch({ type: "LOGIN", user: data.user });
    } catch (e) {
      setError("Wrong Credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <Card style={styles.authContainer}>
        <ScrollView>
          <Input
            label="E-Mail"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(val) => setEmail(val)}
          />
          <Input
            label="Password"
            keyboardType="default"
            secureTextEntry
            minLength={5}
            autoCapitalize="none"
            onChangeText={(val) => setPassword(val)}
          />
          <Button
            title="Sign In"
            onPress={() => {
              onSignInSubmit();
            }}
          />
          <Button
            title="Switch to Sign Up!"
            onPress={() => {
              props.navigation.navigate("Sign Up");
            }}
          />
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 800,
    padding: 20,
    paddingBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
