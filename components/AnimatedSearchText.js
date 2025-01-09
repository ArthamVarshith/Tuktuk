import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const AnimatedSearchText = () => {
  const texts = [
    "Where would you like to go?",
    "Quick, the pool's filling up!"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const animate = () => {
    // Fade out and slide up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(translateYAnim, {
        toValue: -20,
        duration: 500,
        useNativeDriver: true
      })
    ]).start(() => {
      // Update text index
      setCurrentIndex(prevIndex => (prevIndex + 1) % texts.length);
      
      // Reset position without animation
      translateYAnim.setValue(20);
      
      // Fade in and slide up to normal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ]).start();
    });
  };

  useEffect(() => {
    const intervalId = setInterval(animate, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}
      >
        {texts[currentIndex]}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
    marginLeft: 12,
    overflow: 'hidden'
  },
  text: {
    fontSize: 16,
    color: '#666',
  }
});

export default AnimatedSearchText;