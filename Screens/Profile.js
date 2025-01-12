import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firestore, auth, firebase} from "../Firebase/Firebase";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDoc = await firestore.collection("users").doc(userId).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setEmail(userData.email || "");
          setName(userData.name || "");
          setAddress(userData.address || "");
          setProfilePic(userData.profilePic || "https://via.placeholder.com/150");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
        Alert.alert("Error", "Unable to fetch profile data. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const userId = auth.currentUser.uid;

      await firestore.collection("users").doc(userId).set(
        {
          name,
          address,
        },
        { merge: true }
      );

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE], // Use new MediaType
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setProfilePic(imageUri); // Update the state to show the selected image
      }
    } catch (error) {
      console.error("Error picking image:", error.message);
      Alert.alert("Error", "Failed to pick an image. Please try again.");
    }
  };

  const Signout = () => {
    firebase.auth().signOut()
    .then(Alert.alert("Signed out successfully!!"))
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: profilePic }} style={styles.profilePic} />
      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>Pick Profile Picture</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} editable={false} />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={Signout}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfilePage;
