import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronLeft, User } from "lucide-react-native";

// Header component with improved UI
const HeaderComponet = ({
  title,
  onBack,
  logOut,
  activeLogBtn,
}: {
  title: string;
  activeLogBtn: boolean;
  onBack: () => void;
  logOut: () => void;
}) => (
  <View className="bg-blue-600 flex-row justify-between items-center px-4 py-4 w-full">
    <View className="flex-row items-center">
      <TouchableOpacity onPress={onBack} className="mr-3 p-1 rounded-full">
        <ChevronLeft size={26} color="white" />
      </TouchableOpacity>
      <Text className="text-white font-bold text-lg">{title}</Text>
    </View>
    <TouchableOpacity onPress={logOut}>
      {activeLogBtn && (
        <View className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
          <User size={24} color="#2563EB" />
        </View>
      )}
    </TouchableOpacity>
  </View>
);

export default HeaderComponet;