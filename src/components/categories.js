import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  BookOpenIcon,
  ChatBubbleBottomCenterIcon,
} from "react-native-heroicons/solid";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Categories({ activeCategory, setActiveCategory }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="justify-center items-center space-x-4"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        <Animated.View className="flex items-center">
          <TouchableOpacity
            className={`flex items-center justify-center space-y-2 ${
              activeCategory === "Book" ? "bg-gray-300" : "bg-transparent"
            } rounded-full p-2`}
            onPress={() => setActiveCategory("Book")}
          >
            <View
              className={`rounded-full p-[6px] ${
                activeCategory === "Book" ? "bg-gray-300" : "bg-white"
              }`}
            >
              <BookOpenIcon
                size={hp(4)}
                color={activeCategory === "Book" ? "black" : "gray"}
              />
            </View>
          </TouchableOpacity>
          <Text
            className={`text-neutral-600 ${
              activeCategory === "Book" ? "font-bold text-black" : ""
            }`}
            style={{ fontSize: hp(1.6), textAlign: "center" }}
          >
            Book
          </Text>
        </Animated.View>

        <View className="flex items-center">
          <TouchableOpacity
            className={`flex items-center justify-center space-y-2 ${
              activeCategory === "Phrase" ? "bg-gray-300" : "bg-transparent"
            } rounded-full p-2`}
            onPress={() => setActiveCategory("Phrase")}
          >
            <View
              className={`rounded-full p-[6px] ${
                activeCategory === "Phrase" ? "bg-gray-300" : "bg-white"
              }`}
            >
              <ChatBubbleBottomCenterIcon
                size={hp(4)}
                color={activeCategory === "Phrase" ? "black" : "gray"}
              />
            </View>
          </TouchableOpacity>
          <Text
            className={`text-neutral-600 ${
              activeCategory === "Phrase" ? "font-bold text-black" : ""
            }`}
            style={{ fontSize: hp(1.6), textAlign: "center" }}
          >
            Phrase
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
