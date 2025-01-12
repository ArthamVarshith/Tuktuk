import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { firebase } from '../Firebase/Firebase';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';

const DriverScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection('bookings')
        .orderBy('timestamp', 'desc')
        .get();

      const fetchedBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBookings(fetchedBookings);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up real-time listener
    const unsubscribe = firebase
      .firestore()
      .collection('bookings')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const updatedBookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
      case 'pending':
        return '#FFA500';
      case 'assigned':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const renderBookingCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity 
        style={[styles.card, { shadowColor: statusColor }]}
        onPress={() => {/* Handle booking selection */}}
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
              {format(item.time.toDate(), 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.cost}>₹{item.cost}</Text>
          <TouchableOpacity 
            style={styles.assignButton}
            onPress={() => {/* Handle driver assignment */}}
          >
            <Text style={styles.assignButtonText}>Assign Driver</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Auto Bookings</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {bookings.filter(b => b.status === 'Pending').length} Pending
          </Text>
        </View>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    marginTop: 8,
  },
  statsText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  autoTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoType: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cost: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  assignButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DriverScreen;