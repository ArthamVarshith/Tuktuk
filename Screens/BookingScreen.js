import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
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
  MD3LightTheme,
  RadioButton,
  Menu,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT_PERCENTAGE = 0.85;
const MODAL_WIDTH_PERCENTAGE = 0.95;

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF4757',
    secondary: '#2F3542',
    background: '#FFFFFF',
  },
};

const PREDEFINED_LOCATIONS = [
  {
    id: '1',
    name: 'Mandadam/Secretariat',
    latitude: 16.5180,
    longitude: 80.5258,
    description: 'Government Administrative Complex',
    iconName: 'office-building',
    pricing: {
      big: {
        autoRate: 200,
        maxPassengers: 6,
        minRatePerHead: 75,
        minPassengersForMinRate: 4
      },
      small: {
        autoRate: 100,
        maxPassengers: 3,
        minRatePerHead: 50,
        minPassengersForMinRate: 2
      }
    }
  },
  {
    id: '2',
    name: 'Mangalagiri/Undavalli',
    latitude: 16.4325,
    longitude: 80.5588,
    description: 'Historic Temple Town',
    iconName: 'temple-hindu',
    pricing: {
      big: {
        autoRate: 500,
        maxPassengers: 6,
        minRatePerHead: 150,
        minPassengersForMinRate: 4
      },
      small: {
        autoRate: 300,
        maxPassengers: 3,
        minRatePerHead: 150,
        minPassengersForMinRate: 2
      }
    }
  },
  {
    id: '3',
    name: 'Rain Tree Park/Namburu',
    latitude: 16.4478,
    longitude: 80.6163,
    description: 'Recreational Area',
    iconName: 'tree',
    pricing: {
      big: {
        autoRate: 600,
        maxPassengers: 6,
        minRatePerHead: 150,
        minPassengersForMinRate: 4
      },
      small: {
        autoRate: 400,
        maxPassengers: 3,
        minRatePerHead: 200,
        minPassengersForMinRate: 2
      }
    }
  },
  {
    id: '4',
    name: 'Vijayawada Bus Stand/Railway Station',
    latitude: 16.5193,
    longitude: 80.6305,
    description: 'Major Transportation Hub',
    iconName: 'train-car',
    pricing: {
      big: {
        autoRate: 600,
        maxPassengers: 6,
        minRatePerHead: 150,
        minPassengersForMinRate: 4
      },
      small: {
        autoRate: 300,
        maxPassengers: 3,
        minRatePerHead: 150,
        minPassengersForMinRate: 2
      }
    }
  },
  {
    id: '5',
    name: 'Guntur Bus Stand/Railway Station',
    latitude: 16.2986,
    longitude: 80.4428,
    description: 'Guntur Transportation Hub',
    iconName: 'train-car',
    pricing: {
      big: {
        autoRate: 800,
        maxPassengers: 6,
        minRatePerHead: 300,
        minPassengersForMinRate: 4
      },
      small: {
        autoRate: 500,
        maxPassengers: 3,
        minRatePerHead: 250,
        minPassengersForMinRate: 2
      }
    }
  },
  {
    id: '6',
    name: 'Airport-Gannavaram',
    latitude: 16.5175,
    longitude: 80.7975,
    description: 'Vijayawada International Airport',
    iconName: 'airplane',
    pricing: {
      big: {
        autoRate: 1400,
        maxPassengers: 6,
        minRatePerHead: 500,
        minPassengersForMinRate: 4
      },
      small: {
        autoRate: 1000,
        maxPassengers: 3,
        minRatePerHead: 500,
        minPassengersForMinRate: 2
      }
    }
  }
];

const AutoBookingScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showRideDetailsModal, setShowRideDetailsModal] = useState(false);
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [autoType, setAutoType] = useState('small');
  const [rideMode, setRideMode] = useState('realtime');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [totalCost, setTotalCost] = useState(0);
  const [showPassengerMenu, setShowPassengerMenu] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (selectedLocation && autoType) {
      calculateTotalCost();
    }
  }, [numberOfPassengers, selectedLocation, autoType]);

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

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationList(false);
    setShowRideDetailsModal(true);
    setAutoType('small');
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
    console.log('Booking auto with details:', {
      dropLocation: selectedLocation,
      passengers: numberOfPassengers,
      autoType: autoType,
      mode: rideMode,
      date: selectedDate,
      time: selectedTime,
      cost: totalCost
    });
    setShowRideDetailsModal(false);
  };

  const renderIcon = (iconName, size = 24, color = theme.colors.primary) => {
    try {
      return (
        <MaterialCommunityIcons 
          name={iconName} 
          size={size} 
          color={color}
        />
      );
    } catch (error) {
      console.warn(`Icon ${iconName} not found, using fallback`);
      return (
        <MaterialCommunityIcons 
          name="map-marker" 
          size={size} 
          color={color}
        />
      );
    }
  };

  const renderPassengerSelection = () => {
    const maxPassengers = selectedLocation?.pricing[autoType]?.maxPassengers || 3;
    
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
                {numberOfPassengers} Passenger{numberOfPassengers > 1 ? 's' : ''}
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
            title={`${i + 1} Passenger${i > 0 ? 's' : ''}`}
          />
        ))}
      </Menu>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 16.4825,
            longitude: 80.6160,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
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

        <Animated.View style={[styles.searchBar, {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }]
        }]}>
          <TouchableOpacity onPress={() => setShowLocationList(true)}>
            <Card style={styles.searchCard}>
              <Card.Content style={styles.searchContent}>
                {renderIcon('map-marker')}
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
              <ScrollView 
                style={styles.locationScrollView}
                showsVerticalScrollIndicator={false}
              >
                {PREDEFINED_LOCATIONS.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Card style={styles.locationCard}>
                      <Card.Content style={styles.locationCardContent}>
                        {renderIcon(location.iconName)}
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
              <ScrollView 
                style={styles.bookingScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.bookingScrollContent}
              >
                <Text style={styles.modalTitle}>Book Your Auto</Text>
                
                <View style={styles.destinationCard}>
                  {renderIcon(selectedLocation?.iconName || 'map-marker-radius')}
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
                    {renderIcon('car-side')}
                    <Text style={styles.optionTitle}>Auto Type</Text>
                  </View>
                  <RadioButton.Group 
                    onValueChange={value => setAutoType(value)} 
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
                    {renderIcon('account-group')}
                    <Text style={styles.optionTitle}>Number of Passengers</Text>
                  </View>
                  {renderPassengerSelection()}
                  <Text style={styles.costInfo}>
                    {autoType === 'big' 
                      ? `₹${selectedLocation?.pricing.big.minRatePerHead} per person (1-4 passengers) or ₹${selectedLocation?.pricing.big.autoRate} for 5-6 passengers`
                      : `₹${selectedLocation?.pricing.small.minRatePerHead} per person (1-2 passengers) or ₹${selectedLocation?.pricing.small.autoRate} for 3 passengers`
                    }
                  </Text>
                </List.Section>

                <List.Section style={styles.section}>
                  <View style={styles.optionContainer}>
                    {renderIcon('clock-outline')}
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
      </SafeAreaView>
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
    backgroundColor: '#fff',
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
    backgroundColor: 'transparent',
    margin: SCREEN_WIDTH * 0.025,
    maxHeight: SCREEN_HEIGHT * MODAL_HEIGHT_PERCENTAGE,
    width: SCREEN_WIDTH * MODAL_WIDTH_PERCENTAGE,
    alignSelf: 'center',
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
    backgroundColor: '#fff',
    height: '100%',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  locationCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#fff',
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
    flex: 1,
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
    paddingHorizontal: 4,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  radioContainer: {
    marginHorizontal: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
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
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  passengerSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerSelectorText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  }
});

export default AutoBookingScreen;