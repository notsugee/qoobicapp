import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MasonryList from "@react-native-seoul/masonry-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { CachedImage } from "../helpers/image";

export default function Books({ books }) {
  if (!books || books.length === 0) {
    return null; // Return null if there are no books to display
  }

  const navigation = useNavigation();

  return (
    <View className="mx-4 space-y-3">
      <Text
        style={{ fontSize: hp(3) }}
        className="font-semibold text-neutral-600"
      >
        Books
      </Text>
      <View>
        <MasonryList
          data={books}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }) => (
            <BookCard item={item} index={i} navigation={navigation} />
          )}
          onEndReachedThreshold={0.1}
        />
      </View>
    </View>
  );
}

const BookCard = ({ item, index, navigation }) => {
  const isEven = index % 2 === 0;

  // Replace http with https in thumbnail URL if needed
  const secureThumbnail = item.thumbnail.startsWith("http://")
    ? item.thumbnail.replace("http://", "https://")
    : item.thumbnail;

  return (
    <Animated.View
      key={item.id} // Unique key for each book card
      entering={FadeInDown.delay(index * 100).duration(500)} // Fade in down with delay
      style={{ marginBottom: 10 }} // Ensure spacing between cards
    >
      <Pressable
        style={{
          width: "100%",
          paddingLeft: isEven ? 0 : 8,
          paddingRight: isEven ? 8 : 0,
        }}
        className="flex justify-center mb-4 space-y-1"
        onPress={() => navigation.navigate("BookDetail", { ...item })}
      >
        <CachedImage
          source={{ uri: secureThumbnail }}
          style={{
            width: "100%",
            height: index % 3 === 0 ? hp(25) : hp(35),
            borderRadius: 35,
          }}
          className="bg-black/5"
        />
        <Text
          style={{ fontSize: hp(1.5) }}
          className="font-semibold ml-2 text-neutral-600"
        >
          {item.title.length > 20
            ? item.title.slice(0, 20) + "..."
            : item.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
