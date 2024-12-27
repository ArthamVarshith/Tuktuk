import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { firebase } from "../Firebase/Firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [Password, Setpassword] = useState("");

  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, Password)
      .then(() => {
        console.log("User logged in successfully");
      })
      .catch((error) => {
        console.log("Error logging in: ", error.message);
      });
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
        value={email}
      />
      <Text>Password</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(Password) => Setpassword(Password)}
        value={Password}
      />
      <TouchableOpacity onPress={login}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
