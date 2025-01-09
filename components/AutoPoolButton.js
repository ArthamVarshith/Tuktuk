import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import {firebase} from '../Firebase/Firebase'
import { format } from 'date-fns';
import { TouchableOpacity } from 'react-native';

const AutoPoolButton = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const snapshot = await firebase.firestore()
          .collection('bookings')
          .where('status', '==', 'Pending')
          .orderBy('timestamp', 'desc')
          .get();

        const rideData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRides(rideData);
      } catch (err) {
        console.error('Firestore Error:', err);
        setError('Failed to fetch rides. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const RideCard = ({ ride }) => {
    const fillPercentage = (ride.passengers / 6) * 100;
    const formattedTime = format(ride.time.toDate(), 'hh:mm a');

    const getFillColor = () => {
      if (fillPercentage <= 33) return '#FFE0E0';
      if (fillPercentage <= 66) return '#FFB74D';
      return '#81C784';
    };

    return (
      <TouchableOpacity style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.destination} numberOfLines={1}>
              {ride.destination.name}
            </Text>
            <Text style={styles.time}>{formattedTime}</Text>
            <Text style={styles.email}>{ride.userEmail}</Text>
          </View>
          
          <View style={styles.rightContent}>
            <Text style={styles.cost}>₹{ride.cost}</Text>
            <Text style={styles.autoType}>{ride.autoType}</Text>
            <Text style={styles.passengers}>
              {ride.passengers}/6 seats
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressFill,
              {
                width: `${fillPercentage}%`,
                backgroundColor: getFillColor()
              }
            ]}
          />
        </View>

      
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rides}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RideCard ride={item} />}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No rides available</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,

    
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  destination: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#888888',
  },
  cost: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  autoType: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  passengers: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 8,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AutoPoolButton;