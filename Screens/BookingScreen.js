import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Dimensions,
  ScrollView,
  TextInput
} from "react-native";
import { firebase } from "../Firebase/Firebase";

const { width, height } = Dimensions.get('window');

const BookingScreen = () => {
  const [seats, setSeats] = useState(1);
  const [destination, setDestination] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("25 mins");
  const [bookingStatus, setBookingStatus] = useState(null); // null, 'pending', 'confirmed'
  const [driverDetails, setDriverDetails] = useState(null);

  const handleSeatsChange = (action) => {
    if (action === 'increase' && seats < 3) {
      setSeats(seats + 1);
    } else if (action === 'decrease' && seats > 1) {
      setSeats(seats - 1);
    }
  };

  const handleBooking = () => {
    if (!destination) {
      alert("Please enter your destination");
      return;
    }
    setBookingStatus('pending');
    // Simulate auto assignment after 5 seconds
    setTimeout(() => {
      setBookingStatus('confirmed');
      setDriverDetails({
        name: "Raj Kumar",
        autoNumber: "KA 01 AB 1234",
        rating: "4.8",
        eta: "5 mins"
      });
    }, 5000);
  };

  const Logout = () => {
    firebase.auth().signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book Your Auto</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Destination Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Where to?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        {/* Seat Selection */}
        <View style={styles.seatSelector}>
          <Text style={styles.sectionTitle}>Number of Seats</Text>
          <View style={styles.seatControls}>
            <TouchableOpacity 
              style={styles.seatButton} 
              onPress={() => handleSeatsChange('decrease')}
            >
              <Text style={styles.seatButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.seatCount}>{seats}</Text>
            <TouchableOpacity 
              style={styles.seatButton} 
              onPress={() => handleSeatsChange('increase')}
            >
              <Text style={styles.seatButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.seatInfo}>Maximum 3 seats per auto</Text>
        </View>

        {/* Estimated Time */}
        <View style={styles.estimateContainer}>
          <Text style={styles.sectionTitle}>Estimated Travel Time</Text>
          <Text style={styles.estimateTime}>{estimatedTime}</Text>
        </View>

        {/* Booking Status */}
        {bookingStatus && (
          <View style={styles.statusContainer}>
            <Text style={styles.sectionTitle}>Booking Status</Text>
            <View style={[
              styles.statusCard,
              bookingStatus === 'confirmed' ? styles.statusConfirmed : styles.statusPending
            ]}>
              <Text style={styles.statusText}>
                {bookingStatus === 'confirmed' ? 'Confirmed!' : 'Finding your auto...'}
              </Text>
            </View>
          </View>
        )}

        {/* Driver Details */}
        {driverDetails && (
          <View style={styles.driverContainer}>
            <Text style={styles.sectionTitle}>Driver Details</Text>
            <View style={styles.driverCard}>
              <Text style={styles.driverName}>{driverDetails.name}</Text>
              <Text style={styles.driverInfo}>{driverDetails.autoNumber}</Text>
              <View style={styles.driverMeta}>
                <Text style={styles.driverRating}>⭐ {driverDetails.rating}</Text>
                <Text style={styles.driverEta}>Arriving in {driverDetails.eta}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Book Button */}
        {!bookingStatus && (
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleBooking}
          >
            <Text style={styles.bookButtonText}>Book Auto</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    padding: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#222222',
  },
  logoutButton: {
    padding: width * 0.02,
  },
  logoutText: {
    color: '#045757',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: height * 0.03,
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: '#222222',
    marginBottom: height * 0.01,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: height * 0.02,
    fontSize: width * 0.04,
    color: '#222222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  seatSelector: {
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#222222',
    marginBottom: height * 0.015,
  },
  seatControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: height * 0.015,
  },
  seatButton: {
    backgroundColor: '#045757',
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatButtonText: {
    color: '#ffffff',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  seatCount: {
    fontSize: width * 0.05,
    fontWeight: '600',
    marginHorizontal: width * 0.08,
    color: '#222222',
  },
  seatInfo: {
    fontSize: width * 0.03,
    color: '#666666',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  estimateContainer: {
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  estimateTime: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#045757',
  },
  statusContainer: {
    marginBottom: height * 0.03,
  },
  statusCard: {
    padding: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusConfirmed: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#222222',
  },
  driverContainer: {
    marginBottom: height * 0.03,
  },
  driverCard: {
    backgroundColor: '#f5f5f5',
    padding: height * 0.02,
    borderRadius: 12,
  },
  driverName: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#222222',
    marginBottom: height * 0.01,
  },
  driverInfo: {
    fontSize: width * 0.035,
    color: '#666666',
    marginBottom: height * 0.01,
  },
  driverMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
  driverRating: {
    fontSize: width * 0.035,
    color: '#222222',
  },
  driverEta: {
    fontSize: width * 0.035,
    color: '#045757',
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#045757',
    padding: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: height * 0.02,
    shadowColor: '#045757',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});

export default BookingScreen;