import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, PermissionsAndroid } from "react-native";
import { firebase } from "../Firebase/Firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as Location from "expo-location";

const DriverLogin = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const recaptchaVerifier = React.useRef(null);

  // Function to request location permission
  const requestLocationPermission = async () => {
    try {
      console.log("Requesting location permission...");

      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log(`Location Permission: ${status}`);

      return status === "granted";
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  };
  

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
      />
      <Text style={styles.title}>Enter Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DriverOTPScreen")}
      >
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default DriverLogin;
