import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "../Firebase/Firebase";
import LandingPage from "../Screens/LandingPage";
import UserLogin from "../Screens/UserLogin";
import UserRegister from "../Screens/UserRegister";
import DriverLogin from "../Screens/DriverLogin";
import BookingScreen from "../Screens/BookingScreen";

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
        <Stack.Screen name="LandingPage" component={LandingPage}/>
          <Stack.Screen name="UserLogin" component={UserLogin} />
          <Stack.Screen name="UserRegister" component={UserRegister} />
          <Stack.Screen name="DriverLogin" component={DriverLogin}/>
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
