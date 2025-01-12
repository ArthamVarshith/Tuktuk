import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { firestore, auth } from "../Firebase/Firebase";

const RideHistoryPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const userEmail = auth.currentUser.email; // Get the current user's email
        
        // Query the bookings collection by userEmail
        const rideSnapshot = await firestore
          .collection("bookings")
          .where("userEmail", "==", userEmail)
          .get();

        // Map through the snapshot and fetch ride data
        const rideData = rideSnapshot.docs.map((doc) => doc.data());
        setRides(rideData); // Set the fetched rides in state
      } catch (err) {
        setError("Error fetching ride history. Please try again.");
        console.error("Error fetching ride history:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Fetching your ride history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Ride History</Text>
      <FlatList
        data={rides}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.rideCard}>
            <Text style={styles.rideDetails}>Date: {item.date.toDate().toString()}</Text>
            <Text style={styles.rideDetails}>Destination: {item.destination.name}</Text>
            <Text style={styles.rideDetails}>Auto Type: {item.autoType}</Text>
            <Text style={styles.rideDetails}>Cost: ₹{item.cost}</Text>
            <Text style={styles.rideDetails}>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#888",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  rideCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rideDetails: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
});

export default RideHistoryPage;
