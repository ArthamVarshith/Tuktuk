import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "../Firebase/Firebase";
import LandingPage from "../Screens/LandingPage";
import UserLogin from "../Screens/UserLogin";
import UserRegister from "../Screens/UserRegister";
import DriverLogin from "../Screens/DriverLogin";
import DriverOTPScreen from "../Screens/DriverOTPScreen";
import BookingScreen from "../Screens/BookingScreen";
import DriverScreen from "../Screens/DriverScreen";
import Profile from "../Screens/Profile";
import History from "../Screens/History";
import BookedScreen from "../Screens/BookedScreens";
import DriverProfile from "../Screens/DriverProfile";
import ScheduledBooking from "../Screens/ScheduledBooking"

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
        headerShown: false,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="UserLogin" component={UserLogin} />
          <Stack.Screen name="UserRegister" component={UserRegister} />
          <Stack.Screen name="DriverLogin" component={DriverLogin} />
          <Stack.Screen name="DriverOTPScreen" component={DriverOTPScreen} />
          <Stack.Screen name="DriverScreen" component={DriverScreen} />
          <Stack.Screen name="DriverProfile" component={DriverProfile}/>
        </>
      ) : (
        <>
          <Stack.Screen name="BookedScreen" component={BookedScreen} />
          <Stack.Screen name="BookingScreen" component={BookingScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="ScheduledBooking" component={ScheduledBooking} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routes;
