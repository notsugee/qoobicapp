import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Bars3Icon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/categories";
import Books from "../components/books";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Book");
  const [bookName, setBookName] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("book"); // Initialize with default option

  const searchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = selectedOption === "book" ? "/recommend" : "/phrase";
      const response = await fetch(
        `https://888d-45-251-33-148.ngrok-free.app${endpoint}`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book_name: bookName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch book recommendations");
      }

      const data = await response.json();
      setBooks(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Image
            source={require(`../../assets/favicon.png`)}
            style={{ height: hp(5), width: hp(5.5) }}
            alt="PS"
          />
          <Bars3Icon color="gray" size={hp(4)} />
        </View>

        <View className="mx-4 space-y-2 mb-2">
          <Text style={{ fontSize: hp(1.7) }} className="text-neutral-600">
            Hello, Sujith!
          </Text>
          <View>
            <Text
              style={{ fontSize: hp(3.8) }}
              className="font-semibold text-neutral-600"
            >
              Discover your next
            </Text>
            <Text
              style={{ fontSize: hp(3.8) }}
              className="font-semibold text-neutral-600"
            >
              favorite book
            </Text>
            <Text
              style={{ fontSize: hp(3.8) }}
              className="font-semibold text-neutral-600"
            >
              with <Text className="text-red-300">Qoobic</Text>
            </Text>
          </View>
        </View>

        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder="What would you like to read about?"
            placeholderTextColor="gray"
            style={{ fontSize: hp(1.7) }}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
            value={bookName}
            onChangeText={(text) => setBookName(text)}
            onSubmitEditing={searchBook}
          />
          <TouchableOpacity onPress={searchBook}>
            <View className="bg-white rounded-full p-3">
              <MagnifyingGlassIcon
                size={hp(2.5)}
                strokeWidth={3}
                color="gray"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <Categories
            activeCategory={activeCategory}
            setActiveCategory={(category) => {
              setActiveCategory(category);
              setSelectedOption(category.toLowerCase()); // Update selectedOption based on the category
            }}
          />
        </View>

        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <Books books={books} />
        {loading && <ActivityIndicator size="large" color="#fca5a5" />}
      </ScrollView>
    </View>
  );
}
