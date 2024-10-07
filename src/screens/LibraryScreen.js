import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { Bars3Icon } from "react-native-heroicons/outline";
import { collection, query, getDocs } from "firebase/firestore";
import Books from "../components/books";
import { StatusBar } from "expo-status-bar";
import withDrawer from "../components/DrawerNavigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect } from "@react-navigation/native";

function LibraryScreen({ openDrawer }) {
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchLibraryBooks = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "qoobiclibrary", user.uid, "books"));
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLibraryBooks(books);
      } catch (err) {
        console.error("Error fetching library: ", err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrorMessage("You need to be logged in to view your library.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLibraryBooks();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fca5a5" />
      </View>
    );
  }

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
          <TouchableOpacity onPress={openDrawer}>
            <Bars3Icon color="gray" size={hp(4)} />
          </TouchableOpacity>
        </View>
        <View className="mx-4 space-y-2 mb-2">
          <Text
            style={{ fontSize: hp(3.8) }}
            className="font-semibold text-neutral-600"
          >
            Your Library
          </Text>
        </View>

        {errorMessage ? (
          <View className="mx-4">
            <Text style={{ color: "red", textAlign: "center" }}>
              {errorMessage}
            </Text>
          </View>
        ) : (
          <Books books={libraryBooks} />
        )}
      </ScrollView>
    </View>
  );
}

export default withDrawer(LibraryScreen);
