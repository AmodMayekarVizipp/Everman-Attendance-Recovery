import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import SemesterYearProvider from './store/SemesterYearContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SemesterYearProvider>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="DashboardScreen" options={{ title: 'Dashboard', headerShown: false }} />
      </Stack>
    </SemesterYearProvider>
  );
}
