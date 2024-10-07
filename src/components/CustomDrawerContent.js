import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { auth } from "./firebase";

const CustomDrawerContent = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
        {user ? (
          <>
            <Text>Welcome, {user.email}</Text>
            <Button title="Sign Out" onPress={() => auth.signOut()} />
          </>
        ) : (
          <Button
            title="Login / Sign Up"
            onPress={() => props.navigation.navigate("Login")}
          />
        )}
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
