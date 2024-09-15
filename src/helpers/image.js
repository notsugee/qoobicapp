import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";

export const CachedImage = (props) => {
  const [cachedSource, setCachedSource] = useState(null);

  // Check if props.source exists and has a uri property
  const uri = props.source?.uri;

  useEffect(() => {
    if (!uri) {
      return; // If uri is not available, don't proceed further
    }

    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);
        if (cachedImageData) {
          setCachedSource({ uri: cachedImageData });
        } else {
          const response = await fetch(uri);
          const imageBlob = await response.blob();
          const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => resolve(reader.result);
          });
          await AsyncStorage.setItem(uri, base64Data);
          setCachedSource({ uri: base64Data });
        }
      } catch (error) {
        console.error("Error caching image:", error);
        setCachedSource({ uri });
      }
    };

    getCachedImage();
  }, [uri]); // Add uri as a dependency to the effect

  // Return null or a placeholder if the source or cachedSource is not available
  if (!cachedSource) {
    return null;
  }

  return <Animated.Image source={cachedSource} {...props} />;
};
