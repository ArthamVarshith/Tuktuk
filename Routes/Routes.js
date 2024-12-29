import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login";
import { firebase } from "../Firebase/Firebase";
import BookingScreen from "../Screens/BookingScreen";
import Register from "../Screens/Register";

const Routes = () => {
  const Stack = createStackNavigator();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Disable headers for all screens
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <>
          <Stack.Screen name="BookingScreen" component={BookingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routes;
