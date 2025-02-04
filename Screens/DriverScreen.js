import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { firebase } from "../Firebase/Firebase";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";

const DriverScreen = ({ navigation, route }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const { Email } = route.params;

  const fetchBookings = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("bookings")
        .orderBy("timestamp", "desc")
        .get();

      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(fetchedBookings);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up real-time listener
    const unsubscribe = firebase
      .firestore()
      .collection("bookings")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const updatedBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(updatedBookings);
      });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "assigned":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      default:
        return "#757575";
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <MaterialIcons name="notifications" size={20} color="#333" />
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  const renderBookingCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={[styles.card, { shadowColor: statusColor }]}
        onPress={() => {
          /* Handle booking selection */
        }}
      >
        <View style={styles.headerRow}>
          <View style={styles.autoTypeContainer}>
            <MaterialIcons name="directions-car" size={24} color="#333" />
            <Text style={styles.autoType}>{item.autoType}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <MaterialIcons name="person" size={20} color="#666" />
            <Text style={styles.detailText}>{item.userEmail}</Text>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.detailText}>{item.destination.name}</Text>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="group" size={20} color="#666" />
            <Text style={styles.detailText}>{item.passengers} passengers</Text>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={styles.detailText}>
              {format(item.time.toDate(), "MMM d, yyyy h:mm a")}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.cost}>₹{item.cost}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Name</Text>
        <TouchableOpacity style={styles.notification} onPress={toggleModal}>
          <MaterialIcons name="notifications" size={30} color={"black"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("DriverProfile", { Email: Email })}
          style={styles.profile}
        >
          <MaterialIcons name="person" size={30} color={"black"} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal}
              >
                <MaterialIcons name="close" size={25} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={renderNotification}
              ListEmptyComponent={
                <Text style={styles.noNotifications}>No notifications</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  notification: {
    marginLeft: 120,
  },
  profile: {
    marginLeft: 15,
  },
  statsContainer: {
    marginTop: 8,
  },
  statsText: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  autoTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  autoType: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  detailsContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  cost: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: "50%", // Half-screen
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalheader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    alignSelf: "center",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  notificationText: { marginLeft: 10, fontSize: 16, color: "#333" },
  noNotifications: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },

  closeButton: {
    marginTop: 3,
  },
});

export default DriverScreen;
