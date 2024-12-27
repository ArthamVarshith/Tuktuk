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
const aspectRatio = height / width;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully");
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
          <Text style={styles.tagline}>Book your ride instantly</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={[styles.button, styles.googleButton]}>
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to TukTuk?</Text>
          <TouchableOpacity>
            <Text style={styles.signUpText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  logoContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  logoText: {
    fontSize: width * 0.08,
  },
  appName: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#222222',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: width * 0.032,
    color: '#045757',
    marginTop: height * 0.005,
    opacity: 0.8,
  },
  formContainer: {
    marginTop: height * 0.03,
  },
  welcomeText: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#222222',
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    marginBottom: height * 0.015,
  },
  inputLabel: {
    fontSize: width * 0.032,
    color: '#222222',
    marginBottom: height * 0.005,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.035,
    color: '#222222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: height * 0.015,
    marginTop: height * 0.005,
  },
  forgotPasswordText: {
    color: '#045757',
    fontSize: width * 0.032,
    fontWeight: '600',
  },
  button: {
    borderRadius: 12,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.008,
  },
  loginButton: {
    backgroundColor: '#045757',
    shadowColor: '#045757',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#666666',
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.032,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonText: {
    color: '#222222',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.03,
    marginTop: 'auto',
  },
  footerText: {
    color: '#666666',
    fontSize: width * 0.032,
  },
  signUpText: {
    color: '#045757',
    fontSize: width * 0.032,
    fontWeight: '700',
    marginLeft: width * 0.02,
  },
});


export default Login;