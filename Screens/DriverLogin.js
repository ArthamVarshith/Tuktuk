import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, PermissionsAndroid } from "react-native";
import { firebase } from "../Firebase/Firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as Location from "expo-location";
import * as SMS from "expo-sms";

const DriverLogin = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = React.useRef(null);
  const [location, setLocation] = useState(null);

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

  // Check and request SMS permissions on Android
  const requestSMSPermissions = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      {
        title: "SMS Permission",
        message: "This app needs access to send SMS messages.",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const sendSOS = async () => {
    // Requesting location permission
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
  
    if (locationStatus !== 'granted') {
      Alert.alert("Permission Denied", "You need to allow location permission.");
      return;
    }
  
    // Get the current location
    const { coords } = await Location.getCurrentPositionAsync();
    const message = `Emergency! I need help. My location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  
    try {
      // Send SMS
      const result = await SMS.sendSMSAsync(
        ['+919182879315'], // Your emergency contact number
        message
      );
  
      if (result.result === 'sent') {
        Alert.alert("SOS Sent!", "Your SOS message has been sent.");
      } else {
        Alert.alert("Error", "Failed to send SOS.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending the SOS message.");
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

      <View style={{marginTop: 20}}>
        <Text>SOS Emergency Button</Text>
        <Button title="Send SOS" onPress={sendSOS} />
      </View>
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
