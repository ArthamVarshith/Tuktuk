// import React from 'react';
// import { 
//   View, 
//   StyleSheet, 
//   SafeAreaView, 
//   Dimensions 
// } from 'react-native';
// import { 
//   Text, 
//   Card, 
//   Button, 
//   Surface, 
//   Provider as PaperProvider 
// } from 'react-native-paper';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// const BookedScreen = ({ route, navigation }) => {
//   const { rideDetails } = route.params;

//   const formatDateTime = (date, time) => {
//     const rideDate = new Date(date.toDate());
//     const rideTime = new Date(time.toDate());
    
//     return {
//       date: rideDate.toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       }),
//       time: rideTime.toLocaleTimeString('en-IN', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       })
//     };
//   };

//   const { date, time } = formatDateTime(rideDetails.date, rideDetails.time);

//   return (
//     <PaperProvider>
//       <SafeAreaView style={styles.container}>
//         <View style={styles.contentContainer}>
//           <Surface style={styles.successCard}>
//             <MaterialCommunityIcons 
//               name="check-circle" 
//               size={100} 
//               color="#4CAF50" 
//               style={styles.successIcon}
//             />
            
//             <Text style={styles.successTitle}>Ride Confirmed!</Text>
            
//             <Card style={styles.detailsCard}>
//               <Card.Content>
//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons 
//                     name="map-marker" 
//                     size={24} 
//                     color="#FF4757" 
//                   />
//                   <Text style={styles.detailLabel}>Destination</Text>
//                   <Text style={styles.detailValue}>
//                     {rideDetails.destination.name}
//                   </Text>
//                 </View>
                
//                 <View style={styles.divider} />
                
//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons 
//                     name="ticket" 
//                     size={24} 
//                     color="#FF4757" 
//                   />
//                   <Text style={styles.detailLabel}>Booking Code</Text>
//                   <Text style={styles.detailValue}>
//                     {rideDetails.destinationCode}
//                   </Text>
//                 </View>
                
//                 <View style={styles.divider} />
                
//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons 
//                     name="car-side" 
//                     size={24} 
//                     color="#FF4757" 
//                   />
//                   <Text style={styles.detailLabel}>Auto Type</Text>
//                   <Text style={styles.detailValue}>
//                     {rideDetails.autoType === 'big' ? 'Big Auto (6 passengers)' : 'Small Auto (3 passengers)'}
//                   </Text>
//                 </View>
                
//                 <View style={styles.divider} />
                
//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons 
//                     name="account-group" 
//                     size={24} 
//                     color="#FF4757" 
//                   />
//                   <Text style={styles.detailLabel}>Passengers</Text>
//                   <Text style={styles.detailValue}>
//                     {rideDetails.passengers}
//                   </Text>
//                 </View>
                
//                 <View style={styles.divider} />
                
//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons 
//                     name="calendar" 
//                     size={24} 
//                     color="#FF4757" 
//                   />
//                   <Text style={styles.detailLabel}>Date</Text>
//                   <Text style={styles.detailValue}>{date}</Text>
//                 </View>
                
//                 <View style={styles.divider} />
                
//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons 
//                     name="clock-outline" 
//                     size={24} 
//                     color="#FF4757" 
//                   />
//                   <Text style={styles.detailLabel}>Time</Text>
//                   <Text style={styles.detailValue}>{time}</Text>
//                 </View>
                
//                 <View style={styles.divider} />
                
//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons 
//                     name="currency-inr" 
//                     size={24} 
//                     color="#FF4757" 
//                   />
//                   <Text style={styles.detailLabel}>Total Cost</Text>
//                   <Text style={styles.detailValue}>
//                     ₹{rideDetails.cost}
//                   </Text>
//                 </View>
//               </Card.Content>
//             </Card>
            
//             <View style={styles.buttonContainer}>
//               <Button 
//                 mode="contained" 
//                 onPress={() => navigation.navigate('Home')}
//                 style={styles.homeButton}
//               >
//                 Back to Home
//               </Button>
//             </View>
//           </Surface>
//         </View>
//       </SafeAreaView>
//     </PaperProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   successCard: {
//     width: SCREEN_WIDTH * 0.9,
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     elevation: 5,
//     backgroundColor: 'white',
//   },
//   successIcon: {
//     marginBottom: 20,
//   },
//   successTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 20,
//   },
//   detailsCard: {
//     width: '100%',
//     marginBottom: 20,
//     elevation: 3,
//     backgroundColor: '#F9F9F9',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   detailLabel: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#666',
//     flex: 1,
//   },
//   detailValue: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#E0E0E0',
//   },
//   buttonContainer: {
//     width: '100%',
//   },
//   homeButton: {
//     borderRadius: 10,
//     paddingVertical: 10,
//   },
// });

// export default BookedScreen;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from "react-native";
import { MaterialIcons } from "react-native-vector-icons";
import { firestore, auth } from "../Firebase/Firebase";
import { useNavigation } from "@react-navigation/native";

const BookedScreen = () => {
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState(generateOtp()); // Generate OTP
  const navigation = useNavigation();

  const closeButtonOpacity = new Animated.Value(0); // Animation for close button

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const userEmail = auth.currentUser.email;
        const rideSnapshot = await firestore
          .collection("bookings")
          .where("userEmail", "==", userEmail)
          .where("status", "==", "confirmed")
          .limit(1)
          .get();

        const rideData = rideSnapshot.docs.map((doc) => doc.data())[0];
        setRideDetails(rideData);
      } catch (err) {
        setError("Error fetching ride details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
    // Fade-in animation for the close button when the page loads
    Animated.timing(closeButtonOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    navigation.navigate('BookingScreen'); // Navigate to BookingScreen
  };

  // Function to generate 4-digit OTP
  function generateOtp() {
    let otp = '';
    for (let i = 0; i < 4; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading ride details...</Text>
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
      {/* Close Button */}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={25} color="#fff" />
        </TouchableOpacity>
      

      {/* Ride Confirmation UI */}
      <View style={styles.rideDetailsContainer}>
        <Text style={styles.title}>Ride Confirmed!</Text>

        {rideDetails && (
          <>
            {/* Driver Details */}
            <View style={styles.rideInfo}>
              <View style={styles.detailsWrapper}>
                <Text style={styles.driverName}>Driver: {rideDetails.driverName}</Text>
                <Text style={styles.vehicleInfo}>Contact: {rideDetails.vehicleDetails}</Text>
              </View>
            </View>

            {/* OTP Section */}
            <View style={styles.otpContainer}>
              {otp.split('').map((digit, index) => (
                <View key={index} style={styles.otpBox}>
                  <Text style={styles.otpText}>{digit}</Text>
                </View>
              ))}
            </View>

            {/* Ride Details */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailText}>Destination: {rideDetails.destination.name}</Text>
              <Text style={styles.detailText}>Auto Type: {rideDetails.autoType}</Text>
              <Text style={styles.detailText}>Cost: ₹{rideDetails.cost}</Text>
              <Text style={styles.detailText}>Passengers: {rideDetails.passengers}</Text>
              <Text style={styles.detailText}>Ride Date: {new Date(rideDetails.date.seconds * 1000).toLocaleString()}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  closeButton: {
    position: "relative",
    right: 20,
    backgroundColor: "black",  // Bright color for attention
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
    top:20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    marginVertical: 20,
  },
  rideDetailsContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#2c3e50",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  rideInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  detailsWrapper: {
    alignItems: 'flex-start'
  },
  driverName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  vehicleInfo: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",  // Light background for OTP boxes
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  detailsCard: {
    marginBottom: 20,
    backgroundColor: "#ecf0f1", // Light gray background for details card
    padding: 15,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#7f8c8d",
  },
  loadingText: {
    fontSize: 18,
    color: "#3498db",
    textAlign: "center",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 18,
    textAlign: "center",
  },
});

export default BookedScreen;
