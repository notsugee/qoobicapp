import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with:", user.email);
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);

        navigation.replace("Home");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center bg-white"
      behavior="padding"
    >
      <View className="w-4/5">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          className="bg-white p-3 rounded-md mt-1"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          className="bg-white p-3 rounded-md mt-1"
          secureTextEntry
        />
      </View>

      <View className="w-3/5 justify-center items-center mt-10">
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-red-300 w-full p-4 rounded-md items-center"
        >
          <Text className="text-white font-bold text-lg">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-white border-red-300 border-2 w-full p-4 rounded-md mt-2 items-center"
        >
          <Text className="text-red-300 font-bold text-lg">Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
