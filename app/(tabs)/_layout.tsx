import { Tabs } from "expo-router";
import { Home, Search, ReceiptText } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

// Create styled components with NativeWind

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: "#4361EE",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          height: 69 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
      })}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`items-center p-1 rounded-lg ${
                focused ? "bg-blue-100" : "bg-transparent"
              }`}
            >
              <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      {/* Receipt Tab */}
      <Tabs.Screen
        name="Receipt"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`items-center p-1 rounded-lg ${
                focused ? "bg-blue-100" : "bg-transparent"
              }`}
            >
              <Search size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      {/* ReceiptList Tab */}
      <Tabs.Screen
        name="ReceiptList"
        options={{
          title: "Receipts",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`items-center p-1 rounded-lg ${
                focused ? "bg-blue-100" : "bg-transparent"
              }`}
            >
              <ReceiptText
                size={22}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}