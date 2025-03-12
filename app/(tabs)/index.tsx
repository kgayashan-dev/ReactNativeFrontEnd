import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="bg-primary text-4xl font-bold  ">Welcome!</Text>
      <Link href={"/login"} className="bg-primary text-lg font-bold ">
        Login
      </Link>
    </View>
  );
}
