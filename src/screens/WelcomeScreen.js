import { StatusBar } from "expo-status-bar";
import { View, Text, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { CubeIcon } from "react-native-heroicons/solid";

export default function WelcomeScreen() {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  const navigation = useNavigation();
  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;

    setTimeout(
      () => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
      100
    );
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))),
      300
    );
    setTimeout(() => navigation.navigate("Home"), 2500);
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
          {/*
          <Image
            className="scale-50"
            source={require("../../assets/Book.png")}
          />
          */}
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
