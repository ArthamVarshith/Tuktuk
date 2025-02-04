import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { firestore, auth } from "../Firebase/Firebase";
import { Ionicons } from "@expo/vector-icons"; // For back button
import { LinearGradient } from "expo-linear-gradient"; // For gradient backgrounds

const RideHistoryPage = ({ navigation }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null); // For modal details

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

        // Sort rides by date in descending order (most recent first)
        const sortedRides = rideData.sort((a, b) => b.date.toDate() - a.date.toDate());

        setRides(sortedRides); // Set the sorted rides in state
      } catch (err) {
        setError("Error fetching ride history. Please try again.");
        console.error("Error fetching ride history:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50"; // Green
      case "Cancelled":
        return "#F44336"; // Red
      case "Upcoming":
        return "#FFA500"; // Orange
      default:
        return "#9E9E9E"; // Grey
    }
  };

  const renderRideItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rideSegment}
      onPress={() => setSelectedRide(item)}
    >
      <Text style={styles.destinationText}>{item.destination.name}</Text>
      <Text style={styles.dateText}>
        {item.date.toDate().toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

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
    <LinearGradient
      colors={["#6a11cb", "#2575fc"]} // Gradient background
      style={styles.container}
    >
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Ride History</Text>
      </View>

      {/* Ride List */}
      <FlatList
        data={rides}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRideItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for Ride Details */}
      <Modal
        visible={!!selectedRide}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedRide(null)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]} // Gradient background for modal
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Ride Details</Text>
            {selectedRide && (
              <ScrollView>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Date:</Text>{" "}
                  {selectedRide.date.toDate().toLocaleDateString()}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Destination:</Text>{" "}
                  {selectedRide.destination.name}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Auto Type:</Text>{" "}
                  {selectedRide.autoType}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Cost:</Text> ₹
                  {selectedRide.cost}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Status:</Text>{" "}
                  <Text style={{ color: getStatusColor(selectedRide.status) }}>
                    {selectedRide.status}
                  </Text>
                </Text>
              </ScrollView>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedRide(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  rideSegment: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  destinationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  dateText: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 12,
    color: "#fff",
  },
  modalLabel: {
    fontWeight: "600",
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#6a11cb",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RideHistoryPage;