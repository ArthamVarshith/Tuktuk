import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firebase } from '../Firebase/Firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { LogBox } from 'react-native';

// Ignore specific logs
LogBox.ignoreLogs([
  'Failed to initialize reCAPTCHA Enterprise config',
  'Support for defaultProps',
]);

const DriverLogin = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = React.useRef(null);

  const handleSendOTP = async () => {
    const phoneWithCountryCode = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    if (phoneWithCountryCode.length < 10 || !/^\+\d+$/.test(phoneWithCountryCode)) {
      Alert.alert('Error', 'Enter a valid phone number with country code.');
      return;
    }

    setLoading(true);

    try {
      const confirmation = await firebase.auth().signInWithPhoneNumber(phoneWithCountryCode, recaptchaVerifier.current);
      navigation.navigate('DriverOTPScreen', { confirmation });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options} // Or manually add your firebaseConfig
      />
      <Text style={styles.title}>Enter Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("DriverOTPScreen")}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default DriverLogin;
