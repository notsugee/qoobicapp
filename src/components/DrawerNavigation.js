import React, { useRef } from "react";
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

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.7;

const DrawerContent = ({ navigation, closeDrawer }) => {
  return (
    <View className="flex-1 p-5">
      <View className="items-end mb-5">
        <TouchableOpacity onPress={closeDrawer}>
          <XMarkIcon color="gray" size={hp(3)} />
        </TouchableOpacity>
      </View>
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
      <TouchableOpacity
        className="py-4 border-b border-gray-200"
        onPress={() => {
          navigation.navigate("Login");
          closeDrawer();
        }}
      >
        <Text className="text-gray-800 text-lg">Login/Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const withDrawer = (WrappedComponent) => {
  return function WithDrawerComponent({ navigation, ...props }) {
    const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const openDrawer = () => {
      setIsDrawerOpen(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const closeDrawer = () => {
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    };

    return (
      <View className="flex-1">
        <WrappedComponent
          {...props}
          navigation={navigation}
          openDrawer={openDrawer}
        />
        {isDrawerOpen && (
          <TouchableOpacity
            className="absolute inset-0 bg-black/50"
            activeOpacity={1}
            onPress={closeDrawer}
          />
        )}
        <Animated.View
          className="absolute right-0 top-0 bottom-0 bg-white"
          style={{
            width: DRAWER_WIDTH,
            transform: [{ translateX }],
          }}
        >
          <DrawerContent navigation={navigation} closeDrawer={closeDrawer} />
        </Animated.View>
      </View>
    );
  };
};

export default withDrawer;
