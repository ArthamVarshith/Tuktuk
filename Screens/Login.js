import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { firebase } from "../Firebase/Firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [Password, Setpassword] = useState("");

  const login = (email, Password) => {
    firebase.auth().signInWithEmailAndPassword(email, Password);
  };
  return (
    <View>
      <Text>email</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
      />
      <Text>Password</Text>
      <TextInput
        placeholder="Password"
        onChangeText={(Password) => Setpassword(Password)}
      />
      <TouchableOpacity onPress={login(email, Password)}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
