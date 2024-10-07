import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import BookDetailScreen from "../screens/BookDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import LibraryScreen from "../screens/LibraryScreen";

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
