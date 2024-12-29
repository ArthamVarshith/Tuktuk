import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const locations = [
  {
    name: 'Vijayawada Bus Stand',
    link: 'https://g.co/kgs/3Rfw2EN'
  },
  {
    name: 'Vijayawada Railway Station',
    link: 'https://g.co/kgs/DsrXL5X'
  },
  {
    name: 'Vijayawada Airport',
    link: 'https://g.co/kgs/88BnXqg'
  }
];

const BookingScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [seats, setSeats] = useState(1);
  const [isScheduling, setIsScheduling] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Select Date');
  const [selectedTime, setSelectedTime] = useState('Select Time');

  const calculatePrice = () => {
    const pricePerSeat = seats <= 2 ? 250 : 150;
    return seats * pricePerSeat;
  };

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
  };

  const handleOpenMap = async (link) => {
    try {
      await Linking.openURL(link);
    } catch (error) {
      console.error('Error opening map:', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setSelectedDate(selectedDate.toLocaleDateString());
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setDate(selectedTime);
      setSelectedTime(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Location Selection */}
        <Text style={styles.sectionTitle}>Select Pickup Location</Text>
        {locations.map((location) => (
          <TouchableOpacity
            key={location.name}
            style={[
              styles.locationButton,
              selectedLocation?.name === location.name && styles.selectedLocation
            ]}
            onPress={() => handleLocationPress(location)}
          >
            <View style={styles.locationContent}>
              <Text
                style={[
                  styles.locationText,
                  selectedLocation?.name === location.name && styles.selectedLocationText
                ]}
              >
                {location.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleOpenMap(location.link)}
                style={styles.mapLink}
              >
                <MaterialIcons name="location-on" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Seat Selection */}
        <Text style={styles.sectionTitle}>Number of Seats</Text>
        <View style={styles.seatsContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.seatButton, seats === num && styles.selectedSeat]}
              onPress={() => setSeats(num)}
            >
              <Text style={[styles.seatText, seats === num && styles.selectedSeatText]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scheduling */}
        <View style={styles.scheduleContainer}>
          <TouchableOpacity
            style={[styles.scheduleButton, !isScheduling && styles.selectedSchedule]}
            onPress={() => {
              setIsScheduling(false);
              setSelectedDate('Select Date');
              setSelectedTime('Select Time');
            }}
          >
            <Text style={[styles.scheduleText, !isScheduling && styles.selectedScheduleText]}>
              Book Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scheduleButton, isScheduling && styles.selectedSchedule]}
            onPress={() => setIsScheduling(true)}
          >
            <Text style={[styles.scheduleText, isScheduling && styles.selectedScheduleText]}>
              Schedule
            </Text>
          </TouchableOpacity>
        </View>

        {isScheduling && (
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="calendar-today" size={24} color="#333" />
              <Text style={styles.dateTimeText}>{selectedDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <MaterialIcons name="access-time" size={24} color="#333" />
              <Text style={styles.dateTimeText}>{selectedTime}</Text>
            </TouchableOpacity>
          </View>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}

        {/* Price Display */}
        {selectedLocation && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              Total Price: ₹{calculatePrice()}
            </Text>
            <Text style={styles.priceBreakdown}>
              (₹{seats <= 2 ? 250 : 150} × {seats} seats)
            </Text>
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedLocation || (isScheduling && (selectedDate === 'Select Date' || selectedTime === 'Select Time'))) && 
            styles.disabledButton
          ]}
          disabled={!selectedLocation || (isScheduling && (selectedDate === 'Select Date' || selectedTime === 'Select Time'))}
        >
          <Text style={styles.bookButtonText}>Book Ride</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  locationButton: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedLocation: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLocationText: {
    color: '#fff',
  },
  mapLink: {
    padding: 4,
  },
  seatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  seatButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSeat: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  seatText: {
    fontSize: 18,
    color: '#333',
  },
  selectedSeatText: {
    color: '#fff',
  },
  scheduleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scheduleButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  selectedSchedule: {
    backgroundColor: '#333',
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
  },
  selectedScheduleText: {
    color: '#fff',
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  priceContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  priceBreakdown: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;