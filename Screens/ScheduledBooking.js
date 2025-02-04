import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { firestore } from "../Firebase/Firebase";
import { Timestamp } from "firebase/firestore";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const ScheduledBooking = ({ route, navigation }) => {
  const { rideDetails, bookingId } = route.params; // Ride details and booking ID from navigation
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Fetch the booking details from Firestore using the bookingId
        const bookingDoc = await firestore
          .collection("bookings")
          .doc(bookingId)
          .get();

        if (bookingDoc.exists) {
          setBookingData(bookingDoc.data()); // Set the booking data
        } else {
          setError("Booking not found.");
        }
      } catch (err) {
        setError("Error fetching booking details. Please try again.");
        console.error("Error fetching booking details:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Fetching booking details...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Scheduled Booking</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.statusText}>
          Your ride request has been received. You will be notified once the pool
          is filled.
        </Text>

        {/* Ride Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Ride Details</Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Destination:</Text>{" "}
            {rideDetails.destination?.name || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Date & Time:</Text>{" "}
            {rideDetails.date
    ? (rideDetails.date instanceof Timestamp
        ? rideDetails.date.toDate()
        : new Date(rideDetails.date)
      ).toLocaleString()
    : "N/A"}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Auto Type:</Text>{" "}
            {rideDetails.autoType || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Cost:</Text> ₹
            {rideDetails.cost || "N/A"}
          </Text>
        </View>

        {/* Pool Status */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Pool Status</Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Status:</Text>{" "}
            {bookingData?.status || "Pending"}
          </Text>
        </View>

        {/* Driver and Auto Details (Visible after pool is filled) */}
        {bookingData?.status === "Confirmed" ? (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Driver & Auto Details</Text>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Driver Name:</Text>{" "}
              {bookingData.driverName || "N/A"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Auto Number:</Text>{" "}
              {bookingData.autoNumber || "N/A"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>OTP:</Text>{" "}
              {bookingData.otp || "N/A"}
            </Text>
          </View>
        ) : (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Driver & Auto Details</Text>
            <Text style={styles.detailText}>
              Driver details, auto details, and OTP will be displayed here once
              the ride is confirmed.
            </Text>
          </View>
        )}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "600",
  },
});

export default ScheduledBooking;