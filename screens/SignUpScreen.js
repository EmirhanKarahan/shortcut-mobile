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
import { postData } from "../api";

const SignInScreen = (props) => {
  const [error, setError] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("initialState");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const onSignUpSubmit = async () => {
    try {
      const data = await postData(LOCAL_IP + "/users", {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      });
      context.authDispatch({ type: "LOGIN", user: data.user });
    } catch (e) {
      setError("Something went wrong!");
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
            label="First Name"
            keyboardType="default"
            autoCapitalize="words"
            onChangeText={(val) => setFirstName(val)}
          />
          <Input
            label="Last Name"
            keyboardType="default"
            autoCapitalize="words"
            onChangeText={(val) => setLastName(val)}
          />
          <Input
            label="Phone Number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            onChangeText={(val) => setPhoneNumber(val)}
          />
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
            title="Sign Up"
            onPress={() => {
              onSignUpSubmit();
            }}
          />
          <Button
            title="Switch to Sign In!"
            onPress={() => {
              props.navigation.navigate("Sign In");
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
