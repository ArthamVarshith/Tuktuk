import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LandingPage = ({ navigation }) => {
  return (
    <ImageBackground 
      
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,20,0.1)']}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>TukTuk</Text>
            <Text style={styles.subtitle}>Your ride, your way</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.driverButton]}
              onPress={() => navigation.navigate("DriverLogin")}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonRole}>Driver</Text>
                <Text style={styles.buttonSubtext}>Start earning today</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.userButton]}
              onPress={() => navigation.navigate("UserLogin")}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonRole}>Rider</Text>
                <Text style={styles.buttonSubtext}>Book your next ride</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: width * 0.05,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: height * 0.1,
  },
  headerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.12,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: height * 0.01,
  },
  buttonContainer: {
    gap: height * 0.02,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonContent: {
    padding: height * 0.025,
    paddingHorizontal: width * 0.08,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  driverButton: {
    shadowColor: "#045757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  userButton: {
    shadowColor: "#ffa726",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonRole: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "#222222",
  },
  buttonSubtext: {
    fontSize: width * 0.035,
    color: "#666666",
    marginTop: 4,
  },
});

export default LandingPage;