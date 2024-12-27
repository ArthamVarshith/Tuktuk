import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { firebase } from "../Firebase/Firebase";

const BookingScreen = () => {

    const Logout = () => {
        firebase.auth().signOut();
    }
  return (
    <View>
      <Text>BookingScreen</Text>
      <TouchableOpacity onPress={Logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingScreen;
