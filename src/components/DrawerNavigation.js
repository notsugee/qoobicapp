import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Bars3Icon, XMarkIcon } from "react-native-heroicons/outline";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { auth } from "../../firebase"; // Import Firebase auth for login/signup and sign out functionality

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.7;

// Drawer content with conditional Login/Signup or Sign Out button and user email display
const DrawerContent = ({ navigation, closeDrawer }) => {
  const [user, setUser] = useState(null);

  // Track the user's auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set the user state when auth state changes
    });
    return unsubscribe; // Cleanup listener on unmount
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
        closeDrawer(); // Close the drawer after signing out
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <View className="flex-1 p-5">
      {/* Drawer close button */}
      <View className="items-end mb-5">
        <TouchableOpacity onPress={closeDrawer}>
          <XMarkIcon color="gray" size={hp(3)} />
        </TouchableOpacity>
      </View>

      {/* Display logged-in user's email if authenticated */}
      {user && (
        <View className="mb-4">
          <Text className="text-gray-800 text-lg font-semibold">
            Welcome, {user.email}
          </Text>
        </View>
      )}

      {/* Navigation options */}
      <TouchableOpacity
        className="py-4 border-b border-gray-200"
        onPress={() => {
          navigation.navigate("Home");
          closeDrawer();
        }}
      >
        <Text className="text-gray-800 text-lg">Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-4 border-b border-gray-200"
        onPress={() => {
          navigation.navigate("Library");
          closeDrawer();
        }}
      >
        <Text className="text-gray-800 text-lg">Library</Text>
      </TouchableOpacity>

      {/* Conditionally render Login/Signup or Sign Out button */}
      {user ? (
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={handleSignOut}
        >
          <Text className="text-gray-800 text-lg">Sign Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => {
            navigation.navigate("Login");
            closeDrawer();
          }}
        >
          <Text className="text-gray-800 text-lg">Login/Signup</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// HOC to wrap the component with a sliding drawer
const withDrawer = (WrappedComponent) => {
  return function WithDrawerComponent({ navigation, ...props }) {
    const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Open the drawer with animation
    const openDrawer = () => {
      setIsDrawerOpen(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    // Close the drawer with animation
    const closeDrawer = () => {
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    };

    return (
      <View className="flex-1">
        {/* Pass openDrawer to the wrapped component */}
        <WrappedComponent
          {...props}
          navigation={navigation}
          openDrawer={openDrawer}
        />

        {/* Overlay to close the drawer */}
        {isDrawerOpen && (
          <TouchableOpacity
            className="absolute inset-0 bg-black/50"
            activeOpacity={1}
            onPress={closeDrawer}
          />
        )}

        {/* Drawer sliding from the right */}
        <Animated.View
          className="absolute right-0 top-0 bottom-0 bg-white"
          style={{
            width: DRAWER_WIDTH,
            transform: [{ translateX }],
          }}
        >
          {/* Render drawer content */}
          <DrawerContent navigation={navigation} closeDrawer={closeDrawer} />
        </Animated.View>
      </View>
    );
  };
};

export default withDrawer;
