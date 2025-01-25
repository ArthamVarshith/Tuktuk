import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
  FlatList,
  Alert
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import { firebase } from "../Firebase/Firebase";
import AnimatedSearchText from "../components/AnimatedSearchText";
import AutoPoolButton from "../components/AutoPoolButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { firestore, auth } from "../Firebase/Firebase";
import { decode } from "@mapbox/polyline";
import * as SMS from "expo-sms";
import {
  Button,
  Text,
  Provider as PaperProvider,
  Portal,
  Modal as PaperModal,
  Surface,
  SegmentedButtons,
  List,
  Card,
  Chip,
  Divider,
  useTheme,
  MD3LightTheme,
  RadioButton,
  Menu,
  ActivityIndicator,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT_PERCENTAGE = 0.85;
const MODAL_WIDTH_PERCENTAGE = 0.95;

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF4757",
    secondary: "#2F3542",
    background: "#FFFFFF",
  },
};

const PREDEFINED_LOCATIONS = [
  {
    id: "1",
    name: "Mandadam/Secretariat",
    latitude: 16.518,
    longitude: 80.5258,
    description: "Government Administrative Complex",
    iconName: "office-building",
    pricing: {
      big: {
        autoRate: 200,
        maxPassengers: 6,
        minRatePerHead: 75,
        minPassengersForMinRate: 4,
      },
      small: {
        autoRate: 100,
        maxPassengers: 3,
        minRatePerHead: 50,
        minPassengersForMinRate: 2,
      },
    },
  },
  {
    id: "2",
    name: "Mangalagiri/Undavalli",
    latitude: 16.4325,
    longitude: 80.5588,
    description: "Historic Temple Town",
    iconName: "mdi-temple-hindu",
    pricing: {
      big: {
        autoRate: 500,
        maxPassengers: 6,
        minRatePerHead: 150,
        minPassengersForMinRate: 4,
      },
      small: {
        autoRate: 300,
        maxPassengers: 3,
        minRatePerHead: 150,
        minPassengersForMinRate: 2,
      },
    },
  },
  {
    id: "3",
    name: "Rain Tree Park/Namburu",
    latitude: 16.4478,
    longitude: 80.6163,
    description: "Recreational Area",
    iconName: "tree",
    pricing: {
      big: {
        autoRate: 600,
        maxPassengers: 6,
        minRatePerHead: 150,
        minPassengersForMinRate: 4,
      },
      small: {
        autoRate: 400,
        maxPassengers: 3,
        minRatePerHead: 200,
        minPassengersForMinRate: 2,
      },
    },
  },
  {
    id: "4",
    name: "Vijayawada Bus Stand/Railway Station",
    latitude: 16.5193,
    longitude: 80.6305,
    description: "Major Transportation Hub",
    iconName: "train-car",
    pricing: {
      big: {
        autoRate: 600,
        maxPassengers: 6,
        minRatePerHead: 150,
        minPassengersForMinRate: 4,
      },
      small: {
        autoRate: 300,
        maxPassengers: 3,
        minRatePerHead: 150,
        minPassengersForMinRate: 2,
      },
    },
  },
  {
    id: "5",
    name: "Guntur Bus Stand/Railway Station",
    latitude: 16.2986,
    longitude: 80.4428,
    description: "Guntur Transportation Hub",
    iconName: "train-car",
    pricing: {
      big: {
        autoRate: 800,
        maxPassengers: 6,
        minRatePerHead: 300,
        minPassengersForMinRate: 4,
      },
      small: {
        autoRate: 500,
        maxPassengers: 3,
        minRatePerHead: 250,
        minPassengersForMinRate: 2,
      },
    },
  },
  {
    id: "6",
    name: "Airport-Gannavaram",
    latitude: 16.5175,
    longitude: 80.7975,
    description: "Vijayawada International Airport",
    iconName: "airplane",
    pricing: {
      big: {
        autoRate: 1400,
        maxPassengers: 6,
        minRatePerHead: 500,
        minPassengersForMinRate: 4,
      },
      small: {
        autoRate: 1000,
        maxPassengers: 3,
        minRatePerHead: 500,
        minPassengersForMinRate: 2,
      },
    },
  },
];

const SearchingDriversModal = ({ visible, onClose }) => {
  return (
    <PaperModal
      visible={visible}
      dismissable={false}
      contentContainerStyle={styles.searchingModalContainer}
    >
      <Surface style={styles.searchingContent}>
        <View style={styles.searchingIconContainer}>
          <ActivityIndicator size="large" color="#FF4757" />
        </View>
        <Text style={styles.searchingTitle}>Searching for Drivers</Text>
        <Text style={styles.searchingSubtitle}>
          Please wait while we find the best driver for you...
        </Text>
        <View style={styles.searchingStatusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.searchingStatus}>
            Searching nearby drivers...
          </Text>
        </View>
        <Button
          mode="outlined"
          onPress={() => {
            if (onClose) {
              onClose();
            }
          }}
          style={styles.closeSearchingButton}
          labelStyle={styles.closeButtonLabel}
        >
          Cancel Search
        </Button>
      </Surface>
    </PaperModal>
  );
};

const BookingScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showRideDetailsModal, setShowRideDetailsModal] = useState(false);
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [autoType, setAutoType] = useState("small");
  const [rideMode, setRideMode] = useState("realtime");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [totalCost, setTotalCost] = useState(0);
  const [showPassengerMenu, setShowPassengerMenu] = useState(false);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [showSearchingModal, setShowSearchingModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  const sendSOS = async () => {
    try {
      // Requesting location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert("Permission Denied", "You need to allow location permission.");
        return;
      }
  
      // Get the current location
      const { coords } = await Location.getCurrentPositionAsync();
      const message = `Emergency! I need help. My location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  
      console.log("Sending SOS message:", message); // Debugging log for the message
  
      // Send SMS
      const result = await SMS.sendSMSAsync(
        ['+919182879315'], // Your emergency contact number
        message
      );
  
      console.log("SMS result:", result); // Debugging log for SMS result
  
      if (result.result === 'sent') {
        Alert.alert("SOS Sent!", "Your SOS message has been sent.");
      }
    } catch (error) {
      console.error("Error sending SOS:", error); // Log the error to understand the issue
      Alert.alert("Error", "An error occurred while sending the SOS message.");
    }
  };


    const [scale] = useState(new Animated.Value(1)); // Animation for scaling effect
  const [opacity] = useState(new Animated.Value(1)); // Animation for opacity effecte

  // Repeating animation to create a pulsing effect
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2, // Scale up
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, // Scale back down
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8, // Decrease opacity to create a dimming effect
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1, // Restore full opacity
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPulse(); // Start the pulse animation on component mount
  }, []);

  const handleSearchingModalClose = async () => {
    if (activeBookingId) {
      try {
        // Cancel the booking in Firestore
        await firebase
          .firestore()
          .collection("bookings")
          .doc(activeBookingId)
          .update({
            status: "Cancelled",
          });

        // Reset local state
        setShowSearchingModal(false);
        setHasActiveBooking(false);
        setActiveBookingId(null);
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Error cancelling booking. Please try again.");
      }
    } else {
      setShowSearchingModal(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        checkActiveBookings(user.email);
      }
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (selectedLocation && autoType) {
      calculateTotalCost();
    }
  }, [numberOfPassengers, selectedLocation, autoType]);

  const checkActiveBookings = async (userEmail) => {
    try {
      const bookingsRef = firebase.firestore().collection("bookings");
      const snapshot = await bookingsRef
        .where("userEmail", "==", userEmail)
        .where("status", "==", "Pending")
        .get();

      if (!snapshot.empty) {
        setHasActiveBooking(true);
        setActiveBookingId(snapshot.docs[0].id);
        setShowSearchingModal(true);
      } else {
        setHasActiveBooking(false);
        setActiveBookingId(null);
        setShowSearchingModal(false);
      }
    } catch (error) {
      console.error("Error checking active bookings:", error);
    }
  };

  const calculateTotalCost = () => {
    if (!selectedLocation) return;

    const pricing = selectedLocation.pricing[autoType];
    const { autoRate, minRatePerHead, minPassengersForMinRate } = pricing;

    if (numberOfPassengers <= minPassengersForMinRate) {
      setTotalCost(numberOfPassengers * minRatePerHead);
    } else {
      setTotalCost(autoRate);
    }
  };

  const generateDestinationCode = (destinationName) => {
    // Split the destination name into words
    const words = destinationName.split(" ");

    // Take the first letter of the first two words (if available)
    const initials =
      words.length > 1
        ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
        : words[0][0].toUpperCase();

    // Append a random number between 1 and 99
    const randomNumber = Math.floor(Math.random() * 99) + 1;

    // Combine initials and number to create the code
    return `${initials}${randomNumber}`;
  };

  const handleRideConfirm = async () => {
    if (!currentUser) {
      alert("Please login to book a ride");
      return;
    }

    if (hasActiveBooking) {
      alert(
        "You already have an active booking. Please wait for it to complete."
      );
      return;
    }

    setShowSearchingModal(true);

    const rideDate = rideMode === "realtime" ? new Date() : selectedDate;
    const rideTime = rideMode === "realtime" ? new Date() : selectedTime;

    const destinationCode = generateDestinationCode(selectedLocation.name);

    const bookingDetails = {
      destination: {
        name: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
      destinationCode: destinationCode,
      autoType: autoType,
      passengers: numberOfPassengers,
      rideMode: rideMode,
      date: rideDate,
      time: rideTime,
      cost: totalCost,
      status: "Pending",
      userEmail: currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      const bookingsRef = firebase.firestore().collection("bookings");
      const docRef = await bookingsRef.add(bookingDetails);
      setActiveBookingId(docRef.id);
      setHasActiveBooking(true);
      setShowRideDetailsModal(false);

      // Listen for status changes
      const unsubscribe = bookingsRef.doc(docRef.id).onSnapshot((doc) => {
        if (doc.exists) {
          const bookingStatus = doc.data().status;
          if (bookingStatus === "Completed") {
            // Navigate to BookedScreen and pass the ride details
            navigation.navigate("BookedScreen", {
              rideDetails: doc.data(),
              bookingId: docRef.id,
            });
            setShowSearchingModal(false);
            setHasActiveBooking(false);
            unsubscribe();
          }
        }
      });
    } catch (error) {
      console.error("Error adding booking:", error);
      setShowSearchingModal(false);
      alert("There was an error with the booking. Please try again.");
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationList(false);
    setShowRideDetailsModal(true);
    setAutoType("small");
    setNumberOfPassengers(1);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderIcon = (iconName, size = 24, color = theme.colors.primary) => {
    try {
      return (
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      );
    } catch (error) {
      console.warn(`Icon ${iconName} not found, using fallback`);
      return (
        <MaterialCommunityIcons name="map-marker" size={size} color={color} />
      );
    }
  };

  const renderPassengerSelection = () => {
    const maxPassengers =
      selectedLocation?.pricing[autoType]?.maxPassengers || 3;

    return (
      <Menu
        visible={showPassengerMenu}
        onDismiss={() => setShowPassengerMenu(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setShowPassengerMenu(true)}
            style={styles.passengerSelector}
          >
            <View style={styles.passengerSelectorContent}>
              <Text style={styles.passengerSelectorText}>
                {numberOfPassengers} Passenger
                {numberOfPassengers > 1 ? "s" : ""}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </TouchableOpacity>
        }
      >
        {Array.from({ length: maxPassengers }, (_, i) => (
          <Menu.Item
            key={i + 1}
            onPress={() => {
              setNumberOfPassengers(i + 1);
              setShowPassengerMenu(false);
            }}
            title={`${i + 1} Passenger${i > 0 ? "s" : ""}`}
          />
        ))}
      </Menu>
    );
  };

  const toggleButtons = () => {
    setExpanded(!expanded);
    Animated.timing(scaleAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rideStarted, setRideStarted] = useState(false);

  // Request location permission
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return false;
    }
    return true;
  };

  // Fetch ride data from Firestore
  const fetchRideData = async (userEmail) => {
    try {
      const rideRef = firestore.collection("bookings"); // Collection name for rides
      const querySnapshot = await rideRef
        .where("userEmail", "==", userEmail)
        .get();

      if (querySnapshot.empty) {
        console.log("No matching ride data found");
        return null;
      }

      const rideData = querySnapshot.docs[0].data();
      return rideData;
    } catch (error) {
      console.log("Error fetching ride data:", error);
    }
  };

  // Check if the ride conditions are met
  const checkIfRideShouldStart = (rideData) => {
    if (!rideData) return;

    const { status, date, destination } = rideData;

    const currentDate = new Date().toISOString().split("T")[0];

    if (
      status === "confirmed" &&
      date.toDate().toISOString().split("T")[0] === currentDate
    ) {
      setDestination(destination);
      setRideStarted(true);
    } else {
      Alert.alert("Ride Not Active", "No active ride found for today.");
    }
  };

  // Track user's location and update Firestore
  const startLocationTracking = async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    // Update Firestore with the initial location
    const userEmail = auth.currentUser?.email; // Ensure user is logged in
    if (userEmail) {
      updateUserLocationInFirestore(userEmail, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    // Start watching the position for continuous updates
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 0, // Update regardless of movement
      },
      (location) => {
        const updatedLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentLocation(updatedLocation);

        // Update Firestore with the new location
        if (userEmail) {
          updateUserLocationInFirestore(userEmail, updatedLocation);
        }
      }
    );
  };

  // Check and start ride tracking for current user
  const initiateRideTracking = async () => {
    const userEmail = auth.currentUser?.email; // Get the current user's email from Firebase Auth
    if (!userEmail) {
      Alert.alert("User not logged in", "Please log in to track your ride.");
      return;
    }

    const rideData = await fetchRideData(userEmail);
    checkIfRideShouldStart(rideData);
  };

  useEffect(() => {
    const initialize = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        initiateRideTracking();
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (rideStarted) {
      startLocationTracking();
    }
  }, [rideStarted]);

  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Function to fetch route from an API
  const fetchRoute = async (currentLocation, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${destination.latitude},${destination.longitude}&departure_time=now&traffic_model=best_guess&key=AIzaSyBQGYLUr0pgOCIu4rYyhmKvyQ4M4_G_b3U`
      );
      const data = await response.json();

      if (data.routes.length > 0) {
        // Decode detailed polyline points
        const detailedCoordinates = [];
        data.routes[0].legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            const points = decode(step.polyline.points);
            const coordinates = points.map((point) => ({
              latitude: point[0],
              longitude: point[1],
            }));
            detailedCoordinates.push(...coordinates);
          });
        });

        setRouteCoordinates(detailedCoordinates);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Fetch route whenever location changes
  useEffect(() => {
    if (currentLocation && destination) {
      fetchRoute(currentLocation, destination);
    }
  }, [currentLocation, destination]);

  console.log(MapView);

  // Update location in Firestore
  const updateUserLocationInFirestore = async (userEmail, location) => {
    try {
      const userLocationRef = firestore
        .collection("userLocations")
        .doc(userEmail); // Create a document with user's email as ID
      await userLocationRef.set({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(), // Add a timestamp
      });
      console.log("User location updated in Firestore.");
    } catch (error) {
      console.error("Error updating user location in Firestore:", error);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.latitude || 16.4825,
            longitude: currentLocation?.longitude || 80.616,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
        </MapView>

        <Animated.View
          style={[
            styles.searchBar,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              if (!hasActiveBooking) {
                setShowLocationList(true);
              } else {
                alert(
                  "You have an active booking. Please wait for it to complete."
                );
              }
            }}
          >
            <Card style={styles.searchCard}>
              <Card.Content style={styles.searchContent}>
                {renderIcon("map-marker")}
                <AnimatedSearchText />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.container1}>
          {/* Profile Button */}
          <Animated.View
            style={[
              styles.extraButton,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -70],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Profile")}
            >
              <MaterialIcons name="person" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* History Button */}
          <Animated.View
            style={[
              styles.extraButton,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -140],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("History")}
            >
              <MaterialIcons name="history" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* Main Circular Button */}
          <TouchableOpacity style={styles.mainButton} onPress={toggleButtons}>
            <MaterialIcons
              name={expanded ? "close" : "menu"}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <Portal>
          <PaperModal
            visible={showLocationList}
            onDismiss={() => setShowLocationList(false)}
            contentContainerStyle={[
              styles.modalContent,
              styles.locationListModal,
            ]}
          >
            <Surface style={styles.modalSurface}>
              <Text style={styles.modalTitle}>Select Destination</Text>
              <FlatList
                data={PREDEFINED_LOCATIONS}
                ListHeaderComponent={<AutoPoolButton />}
                renderItem={({ item: location }) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Card style={styles.locationCard}>
                      <Card.Content style={styles.locationCardContent}>
                        {renderIcon(location.iconName)}
                        <View style={styles.locationTextContainer}>
                          <Text style={styles.locationName}>
                            {location.name}
                          </Text>
                          <Text style={styles.locationDescription}>
                            {location.description}
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                style={styles.locationScrollView}
              />
            </Surface>
          </PaperModal>
        </Portal>

        <Portal>
          <PaperModal
            visible={showRideDetailsModal}
            onDismiss={() => setShowRideDetailsModal(false)}
            contentContainerStyle={[styles.modalContent, styles.bookingModal]}
          >
            <Surface style={styles.modalSurface}>
              <ScrollView
                style={styles.bookingScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.bookingScrollContent}
              >
                <Text style={styles.modalTitle}>Book Your Auto</Text>

                <View style={styles.destinationCard}>
                  {renderIcon(
                    selectedLocation?.iconName || "map-marker-radius"
                  )}
                  <View style={styles.destinationTextContainer}>
                    <Text style={styles.destinationTitle}>Destination</Text>
                    <Text style={styles.destinationName}>
                      {selectedLocation?.name}
                    </Text>
                  </View>
                </View>

                <Divider style={styles.divider} />

                <List.Section style={styles.section}>
                  <View style={styles.optionContainer}>
                    {renderIcon("car-side")}
                    <Text style={styles.optionTitle}>Auto Type</Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) => setAutoType(value)}
                    value={autoType}
                  >
                    <View style={styles.radioContainer}>
                      <View style={styles.radioOption}>
                        <RadioButton value="small" />
                        <Text>Small Auto (max 3 passengers)</Text>
                      </View>
                      <View style={styles.radioOption}>
                        <RadioButton value="big" />
                        <Text>Big Auto (max 6 passengers)</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </List.Section>

                <List.Section style={styles.section}>
                  <View style={styles.optionContainer}>
                    {renderIcon("account-group")}
                    <Text style={styles.optionTitle}>Number of Passengers</Text>
                  </View>
                  {renderPassengerSelection()}
                  <Text style={styles.costInfo}>
                    {autoType === "big"
                      ? `₹${selectedLocation?.pricing.big.minRatePerHead} per person (1-4 passengers) or ₹${selectedLocation?.pricing.big.autoRate} for 5-6 passengers}`
                      : `₹${selectedLocation?.pricing.small.minRatePerHead} per person (1-2 passengers) or ₹${selectedLocation?.pricing.small.autoRate} for 3 passengers`}
                  </Text>
                </List.Section>

                <List.Section style={styles.section}>
                  <View style={styles.optionContainer}>
                    {renderIcon("clock-outline")}
                    <Text style={styles.optionTitle}>Ride Mode</Text>
                  </View>
                  <SegmentedButtons
                    value={rideMode}
                    onValueChange={setRideMode}
                    buttons={[
                      { value: "realtime", label: "Real-time" },
                      { value: "scheduled", label: "Scheduled" },
                    ]}
                    style={styles.segmentedButton}
                  />
                </List.Section>

                {rideMode === "scheduled" && (
                  <View style={styles.schedulingContainer}>
                    <Chip
                      icon="calendar"
                      onPress={() => setShowDatePicker(true)}
                      style={styles.chip}
                    >
                      {formatDate(selectedDate)}
                    </Chip>
                    <Chip
                      icon="clock-outline"
                      onPress={() => setShowTimePicker(true)}
                      style={styles.chip}
                    >
                      {formatTime(selectedTime)}
                    </Chip>
                  </View>
                )}

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}

                {showTimePicker && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}

                <View style={styles.costContainer}>
                  <Text style={styles.costLabel}>Total Cost</Text>
                  <Text style={styles.costAmount}>₹{totalCost}</Text>
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleRideConfirm}
                    style={styles.confirmButton}
                    contentStyle={styles.buttonContent}
                    disabled={hasActiveBooking}
                  >
                    {hasActiveBooking
                      ? "Booking in Progress"
                      : "Confirm Booking"}
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => setShowRideDetailsModal(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                </View>
              </ScrollView>
            </Surface>
          </PaperModal>
        </Portal>

        <Portal>
          <SearchingDriversModal
            visible={showSearchingModal}
            onClose={handleSearchingModalClose}
          />
        </Portal>

        {/* Animated SOS Button */}
      <Animated.View
        style={[
          styles.sosButtonContainer,
          {
            opacity: opacity, // Apply animated opacity
            transform: [{ scale: scale }], // Apply animated scaling
          },
        ]}
      >
        <MaterialIcons
          name="error-outline" // SOS icon (you can choose any icon)
          size={38}
          color="red" // Bright color (Tomato Red)
          onPress={sendSOS}
        />
      </Animated.View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  searchBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
    zIndex: 1,
  },
  searchCard: {
    elevation: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
    marginLeft: 12,
  },
  modalContent: {
    backgroundColor: "transparent",
    margin: SCREEN_WIDTH * 0.025,
    maxHeight: SCREEN_HEIGHT * MODAL_HEIGHT_PERCENTAGE,
    width: SCREEN_WIDTH * MODAL_WIDTH_PERCENTAGE,
    alignSelf: "center",
  },
  locationListModal: {
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  bookingModal: {
    maxHeight: SCREEN_HEIGHT * MODAL_HEIGHT_PERCENTAGE,
  },
  modalSurface: {
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    backgroundColor: "#fff",
    height: "100%",
  },
  locationScrollView: {
    flexGrow: 0,
    marginTop: 10,
  },
  bookingScrollView: {
    flexGrow: 1,
  },
  bookingScrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  locationCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: "#fff",
  },
  locationCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: "#666",
  },
  destinationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 20,
  },
  destinationTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  destinationTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  radioContainer: {
    marginHorizontal: 4,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  segmentedButton: {
    marginBottom: 12,
  },
  costInfo: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 8,
  },
  schedulingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 4,
  },
  chip: {
    minWidth: SCREEN_WIDTH * 0.35,
    marginHorizontal: 0,
  },
  costContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginVertical: 24,
  },
  costLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  costAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  confirmButton: {
    marginBottom: 0,
    borderRadius: 8,
    elevation: 2,
  },
  cancelButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  passengerSelector: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  passengerSelectorContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passengerSelectorText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "500",
  },

  searchingModalContainer: {
    backgroundColor: "transparent",
    padding: 20,
    margin: 20,
  },
  searchingContent: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "white",
  },
  searchingIconContainer: {
    marginBottom: 20,
  },
  searchingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  searchingSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  searchingStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20, // Added margin bottom for spacing
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4757",
    marginRight: 8,
  },
  searchingStatus: {
    fontSize: 14,
    color: "#444",
  },
  closeSearchingButton: {
    marginTop: 16,
    width: "100%",
    borderColor: "#FF4757",
  },
  closeButtonLabel: {
    color: "#FF4757",
    fontSize: 16,
  },
  container1: {
    position: "absolute", // Position it above the map
    bottom: 20, // Offset from the bottom of the screen
    right: 20, // Offset from the right edge
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Ensure it is above the map
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  extraButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  sosButtonContainer: {
    position: "absolute",
    bottom: 40, // Adjust as needed
    transform: [{ translateX: -100 }], // Center the button
    backgroundColor: "white", // Optional background for the button container
    borderRadius: 30,
    width: "10%", // Adjust width for better fit
    alignItems: "center",
    marginLeft: 160
  },
});

export default BookingScreen;
