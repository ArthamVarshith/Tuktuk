import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TukTuk</Text>
      <Text style={styles.subtitle}>Select your role to continue</Text>

      <TouchableOpacity
        style={[styles.button, styles.driverButton]}
        onPress={() => navigation.navigate("DriverLogin")}
      >
        <Text style={styles.buttonText}>Driver</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.userButton]}
        onPress={() => navigation.navigate("UserLogin")}
      >
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#222222",
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#666666",
    marginBottom: height * 0.05,
  },
  button: {
    width: "80%",
    paddingVertical: height * 0.02,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  driverButton: {
    backgroundColor: "#045757",
  },
  userButton: {
    backgroundColor: "#ffa726",
  },
  buttonText: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default LandingPage;
