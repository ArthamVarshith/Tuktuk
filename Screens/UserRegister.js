import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from "react-native";
import { firebase } from "../Firebase/Firebase";

const { width, height } = Dimensions.get('window');

const UserRegister = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      alert("Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.content}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🛺</Text>
          </View>
          <Text style={styles.appName}>TukTuk</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </View>

        {/* Register Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Join Us!</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#045757"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#045757"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#045757"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.registerButton]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? "Creating account..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("UserLogin")}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: height * 0.02,
  },
  logoContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  logoText: {
    fontSize: width * 0.08,
  },
  appName: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "#222222",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: width * 0.032,
    color: "#045757",
    marginTop: height * 0.005,
    opacity: 0.8,
  },
  formContainer: {
    marginTop: height * 0.03,
  },
  welcomeText: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#222222",
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    marginBottom: height * 0.015,
  },
  inputLabel: {
    fontSize: width * 0.032,
    color: "#222222",
    marginBottom: height * 0.005,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.035,
    color: "#222222",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    borderRadius: 12,
    paddingVertical: height * 0.015,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.008,
  },
  registerButton: {
    backgroundColor: "#045757",
    shadowColor: "#045757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: height * 0.03,
    marginTop: "auto",
  },
  footerText: {
    color: "#666666",
    fontSize: width * 0.032,
  },
  signInText: {
    color: "#045757",
    fontSize: width * 0.032,
    fontWeight: "700",
    marginLeft: width * 0.02,
  },
});

export default UserRegister;
