import { Stack } from 'expo-router';
import {useFonts} from "expo-font";

export default function Layout() {
    const [fontsLoaded] = useFonts({
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    });
  return (
      <Stack
          screenOptions={{
            headerShown: false,
          }}
      />
  );
}