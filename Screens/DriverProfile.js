import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { firestore, auth } from "../Firebase/Firebase";

const DriverProfile = ({ route }) => {
  const { Email } = route.params;
  const [driver, SetDriver] = useState(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const querysnapshot = await firestore
          .collection("Drivers")
          .where("Email", "==", Email)
          .get();

        if (!querysnapshot.empty) {
          SetDriver(querysnapshot.docs[0].data());
        } else {
          console.log("No driver found");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchDriverDetails();
  }, [Email]);

  if (!driver) {
    return <Text>No driver found</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              driver.profileImage ||
              "https://dc-dermdocs.com/wp-content/uploads/shutterstock_149962697.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{driver.Name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{driver.Phone}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Rating:</Text>
        <Text style={styles.value}>{driver.Rating} / 5</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Earnings:</Text>
        <Text style={styles.value}>₹{driver["Total earnings"]}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Rides:</Text>
        <Text style={styles.value}>{driver["Total rides"]}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Vehicle Model:</Text>
        <Text style={styles.value}>{driver.Vehicle?.model}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Vehicle Number:</Text>
        <Text style={styles.value}>{driver.Vehicle?.number}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            { color: driver.status === "Available" ? "green" : "red" },
          ]}
        >
          {driver.status}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
  },
});

export default DriverProfile;
