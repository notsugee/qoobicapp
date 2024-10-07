import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { CubeIcon } from "react-native-heroicons/solid";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);
  const navigation = useNavigation();

  useEffect(() => {
    const runAnimation = () => {
      ring1padding.value = withSpring(hp(5), { duration: 300 });
      ring2padding.value = withSpring(hp(5.5), { duration: 300 });
    };

    const checkIfFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");

      if (hasLaunched) {
        navigation.replace("Home");
      } else {
        await AsyncStorage.setItem("hasLaunched", "true");
        runAnimation();

        setTimeout(() => {
          navigation.replace("Home");
        }, 2500);
      }
    };

    checkIfFirstLaunch();
  }, []);

  return (
    <View className="flex-1 justify-center items-center space-y-10 bg-white">
      <StatusBar style="dark" />

      <Animated.View
        className="bg-red-300/20 rounded-full"
        style={{ padding: ring2padding }}
      >
        <Animated.View
          className="bg-red-300/20 rounded-full"
          style={{ padding: ring1padding }}
        >
          <CubeIcon style={{ color: "#000000" }} size={hp(10)} />
        </Animated.View>
      </Animated.View>

      <View className="flex items-center space-y-2">
        <Text style={{ fontSize: hp(7) }} className="font-bold tracking-widest">
          QOOBIC
        </Text>
      </View>
    </View>
  );
}
