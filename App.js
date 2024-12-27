import { StyleSheet, View, Text } from "react-native";
import * as Font from "expo-font";
import Routes from "./Routes/Routes";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

const customFonts = {

};

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return (
        <View style={styles.container}>
          <Text>Loading Fonts...</Text>
        </View>
      );
    }

    return (
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
