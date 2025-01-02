import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  MD3LightTheme
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT_PERCENTAGE = 0.8;
const MODAL_WIDTH_PERCENTAGE = 0.9;

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF4757',
    secondary: '#2F3542',
    background: '#FFFFFF',
  },
};

// Predefined locations remain the same...
const PREDEFINED_LOCATIONS = [
  {
    id: '1',
    name: 'Vijayawada Bus Stand',
    latitude: 16.5157,
    longitude: 80.6343,
    description: 'Pandit Nehru Bus Station (PNBS)',
    iconName: 'bus'
  },
  {
    id: '2',
    name: 'Vijayawada Railway Station',
    latitude: 16.5174,
    longitude: 80.6197,
    description: 'Major Railway Junction in South Central Railway',
    iconName: 'train'
  },
  {
    id: '3',
    name: 'Vijayawada Airport',
    latitude: 16.5306,
    longitude: 80.7967,
    description: 'International Airport (VGA)',
    iconName: 'airplane'
  }
];

const RideBookingScreen = () => {
  // State declarations remain the same...
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showRideDetailsModal, setShowRideDetailsModal] = useState(false);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [rideMode, setRideMode] = useState('realtime');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [totalCost, setTotalCost] = useState(250);

  // Effects and handlers remain the same...
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const costPerSeat = numberOfSeats <= 2 ? 250 : 150;
    setTotalCost(costPerSeat * numberOfSeats);
  }, [numberOfSeats]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationList(false);
    setShowRideDetailsModal(true);
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
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRideConfirm = () => {
    console.log('Booking ride with details:', {
      dropLocation: selectedLocation,
      seats: numberOfSeats,
      mode: rideMode,
      date: selectedDate,
      time: selectedTime,
      cost: totalCost
    });
    setShowRideDetailsModal(false);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 16.5157,
            longitude: 80.6343,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {PREDEFINED_LOCATIONS.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              onPress={() => handleLocationSelect(location)}
              title={location.name}
              description={location.description}
            />
          ))}
        </MapView>

        <Animated.View 
          style={[styles.searchBar, {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })
            }]
          }]}
        >
          <TouchableOpacity onPress={() => setShowLocationList(true)}>
            <Card style={styles.searchCard}>
              <Card.Content style={styles.searchContent}>
                <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
                <Text style={styles.searchText}>
                  {selectedLocation ? selectedLocation.name : "Where would you like to go?"}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </Animated.View>

        <Portal>
          <PaperModal
            visible={showLocationList}
            onDismiss={() => setShowLocationList(false)}
            contentContainerStyle={[styles.modalContent, styles.locationListModal]}
          >
            <Surface style={styles.modalSurface}>
              <Text style={styles.modalTitle}>Select Destination</Text>
              <ScrollView style={styles.locationScrollView}>
                {PREDEFINED_LOCATIONS.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Card style={styles.locationCard}>
                      <Card.Content style={styles.locationCardContent}>
                        <MaterialCommunityIcons 
                          name={location.iconName} 
                          size={24} 
                          color={theme.colors.primary} 
                        />
                        <View style={styles.locationTextContainer}>
                          <Text style={styles.locationName}>{location.name}</Text>
                          <Text style={styles.locationDescription}>
                            {location.description}
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
              <ScrollView style={styles.bookingScrollView}>
                <Text style={styles.modalTitle}>Book Your Ride</Text>
                
                <View style={styles.destinationCard}>
                  <MaterialCommunityIcons 
                    name="map-marker-radius" 
                    size={24} 
                    color={theme.colors.primary} 
                  />
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
                    <MaterialCommunityIcons 
                      name="account-group" 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                    <Text style={styles.optionTitle}>Number of Seats</Text>
                  </View>
                  <SegmentedButtons
                    value={numberOfSeats.toString()}
                    onValueChange={(value) => setNumberOfSeats(parseInt(value))}
                    buttons={[
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' },
                      { value: '4', label: '4' },
                    ]}
                    style={styles.segmentedButton}
                  />
                  <Text style={styles.costInfo}>
                    ₹{numberOfSeats <= 2 ? '250' : '150'} per seat
                  </Text>
                </List.Section>

                <List.Section style={styles.section}>
                  <View style={styles.optionContainer}>
                    <MaterialCommunityIcons 
                      name="clock-outline" 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                    <Text style={styles.optionTitle}>Ride Mode</Text>
                  </View>
                  <SegmentedButtons
                    value={rideMode}
                    onValueChange={setRideMode}
                    buttons={[
                      { value: 'realtime', label: 'Real-time' },
                      { value: 'scheduled', label: 'Scheduled' },
                    ]}
                    style={styles.segmentedButton}
                  />
                </List.Section>

                {rideMode === 'scheduled' && (
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
                  >
                    Confirm Booking
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
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  searchBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
    zIndex: 1,
  },
  searchCard: {
    elevation: 4,
    borderRadius: 12,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    marginLeft: 12,
  },
  modalContent: {
    margin: SCREEN_WIDTH * 0.05,
    maxHeight: SCREEN_HEIGHT * MODAL_HEIGHT_PERCENTAGE,
    width: SCREEN_WIDTH * MODAL_WIDTH_PERCENTAGE,
    alignSelf: 'center',
  },
  locationListModal: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  bookingModal: {
    maxHeight: SCREEN_HEIGHT * MODAL_HEIGHT_PERCENTAGE,
  },
  modalSurface: {
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    backgroundColor: '#fff',
    height: '100%',
  },
  locationScrollView: {
    flexGrow: 0,
  },
  bookingScrollView: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  locationCard: {
    marginBottom: 12,
    elevation: 2,
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
  },
  destinationTextContainer: {
    marginLeft: 15,
  },
  destinationTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  segmentedButton: {
    marginBottom: 12,
  },
  costInfo: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  schedulingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 4,
  },
  chip: {
    minWidth: SCREEN_WIDTH * 0.35,
    marginHorizontal: 0,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginVertical: 24,
  },
  costLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  costAmount: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 12,
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
});

export default RideBookingScreen;