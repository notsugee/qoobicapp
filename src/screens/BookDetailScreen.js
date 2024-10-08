import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  ChevronLeftIcon,
  PlusIcon,
  MinusIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { CachedImage } from "../helpers/image";
import { auth, db } from "../../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function BookDetailScreen(props) {
  const item = props.route.params;
  const navigation = useNavigation();
  const [adding, setAdding] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);

  useEffect(() => {
    const checkBookInLibrary = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const libraryCollectionRef = collection(
            db,
            "qoobiclibrary",
            user.uid,
            "books"
          );
          const q = query(
            libraryCollectionRef,
            where("title", "==", item.title),
            where("authors", "==", item.authors || "Unknown Author")
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            setIsInLibrary(true);
          }
        } catch (error) {
          console.error("Error checking library: ", error);
        }
      }
    };

    checkBookInLibrary();
  }, [item.title, item.authors]);

  const secureThumbnail = (uri) => {
    return uri?.startsWith("http://")
      ? uri.replace("http://", "https://")
      : uri;
  };

  const renderStars = (average_rating) => {
    const fullStars = Math.floor(average_rating);
    const hasHalfStar = average_rating % 1 !== 0;
    const totalStars = 5;

    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesome key={index} name="star" size={hp(2.5)} color="#fca5a5" />
        ))}
        {hasHalfStar && (
          <FontAwesome name="star-half-o" size={hp(2.5)} color="#fca5a5" />
        )}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map(
          (_, index) => (
            <FontAwesome
              key={index}
              name="star-o"
              size={hp(2.5)}
              color="#fca5a5"
            />
          )
        )}
      </View>
    );
  };

  const categories = item.categories
    ? Array.isArray(item.categories)
      ? item.categories
      : item.categories.split(";")
    : [];

  const thumbnailUri = secureThumbnail(item.thumbnail);

  const addToLibrary = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Error",
        "You need to be logged in to add a book to your library."
      );
      return;
    }

    setAdding(true);

    try {
      const libraryCollectionRef = collection(
        db,
        "qoobiclibrary",
        user.uid,
        "books"
      );

      const q = query(
        libraryCollectionRef,
        where("title", "==", item.title),
        where("authors", "==", item.authors || "Unknown Author")
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Info", "Book is already in your library");
        return;
      }

      await addDoc(libraryCollectionRef, {
        title: item.title,
        authors: item.authors || "Unknown Author",
        categories: categories,
        thumbnail: thumbnailUri,
        average_rating: item.average_rating || 0,
        description: item.description || "No description available",
        addedAt: new Date(),
      });

      Alert.alert("Success", `${item.title} added to your library!`);
      setIsInLibrary(true);
    } catch (error) {
      console.error("Error adding book to library: ", error);
      Alert.alert("Error", "Failed to add the book to your library.");
    } finally {
      setAdding(false);
    }
  };

  const removeFromLibrary = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Error",
        "You need to be logged in to remove a book from your library."
      );
      return;
    }

    setAdding(true);

    try {
      const libraryCollectionRef = collection(
        db,
        "qoobiclibrary",
        user.uid,
        "books"
      );
      const q = query(
        libraryCollectionRef,
        where("title", "==", item.title),
        where("authors", "==", item.authors || "Unknown Author")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Info", "Book not found in your library");
        return;
      }

      const bookDocId = querySnapshot.docs[0].id;
      await deleteDoc(doc(libraryCollectionRef, bookDocId));

      Alert.alert("Success", `${item.title} removed from your library!`);
      setIsInLibrary(false);
    } catch (error) {
      console.error("Error removing book from library: ", error);
      Alert.alert("Error", "Failed to remove the book from your library.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <ScrollView
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style="light" />
      {/* Book Cover */}
      <View className="flex-row justify-center">
        <CachedImage
          source={{ uri: thumbnailUri }}
          style={{
            width: wp(98),
            height: hp(50),
            borderRadius: 53,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
        />
      </View>

      {/* Back and Add/Remove buttons */}
      <View className="w-full absolute flex-row justify-between items-center pt-14">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full ml-5 bg-white"
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fca5a5" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={isInLibrary ? removeFromLibrary : addToLibrary}
          disabled={adding}
          className="p-2 rounded-full mr-5 bg-white"
        >
          {isInLibrary ? (
            <MinusIcon
              size={hp(3.5)}
              strokeWidth={4.5}
              color={adding ? "gray" : "#fca5a5"}
            />
          ) : (
            <PlusIcon
              size={hp(3.5)}
              strokeWidth={4.5}
              color={adding ? "gray" : "#fca5a5"}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="px-4 flex-1 space-y-4 pt-8">
        <View className="space-y-2">
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.authors}>{item.authors || "Unknown Author"}</Text>

          <View style={styles.genresContainer}>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <View key={index} style={styles.genrePill}>
                  <Text style={styles.genreText}>{category}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.genreText}>No categories available</Text>
            )}
          </View>

          {item.average_rating && renderStars(item.average_rating)}
          <Text style={styles.description}>
            {item.description || "No description available"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#333",
  },
  authors: {
    fontSize: hp(2),
    color: "#666",
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: hp(1),
  },
  genrePill: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  genreText: {
    fontSize: hp(1.8),
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
    marginVertical: hp(1),
  },
  description: {
    fontSize: hp(1.8),
    color: "#666",
  },
});
