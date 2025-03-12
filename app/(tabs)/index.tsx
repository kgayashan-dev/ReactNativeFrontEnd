import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, CreditCard, Award, TrendingUp } from "lucide-react-native";
import authUtils from "@/app/utils/authUtils";

const HomePage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-blue-500 h-full">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {/* Header Section with subtle gradient background */}
          {/* <View className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 shadow-md"> */}
          <View className="bg-blue-500 px-6 py-4 shadow-md">
            <Text className="text-2xl font-bold text-center text-white">
              FINNET DIGITAL
            </Text>
          </View>

          {/* Hero Section with background image */}
          <View className="bg-blue-50 px-6 py-10 items-center">
            <View className="bg-white p-6 rounded-2xl shadow-md w-full mb-4">
              <Text className="text-3xl font-bold text-gray-800 mb-3 text-center">
                Financial Freedom Starts Here
              </Text>
              <Text className="text-gray-600 text-center text-lg">
                Your trusted partner for comprehensive credit solutions.
              </Text>
            </View>

            {/* Call to action button */}
            <TouchableOpacity
              onPress={handleGetStarted}
              className="bg-blue-600 px-8 py-4 rounded-full shadow-lg flex-row items-center mt-4"
            >
              <Text className="text-white font-bold text-lg mr-2">
                Get Started
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Features Section with icons */}
          <View className="px-6 py-8 bg-white">
            <Text className="text-2xl font-bold text-gray-800 mb-6">
              Our Services
            </Text>
            <View className="space-y-4">
              <View className="bg-blue-50 p-6 rounded-xl shadow-sm flex-row items-center">
                <View className="bg-blue-100 p-3 rounded-full mr-4">
                  <CreditCard size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800">
                    Loan Solutions
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Quick and affordable loans tailored to your needs.
                  </Text>
                </View>
              </View>

              <View className="bg-blue-50 p-6 rounded-xl shadow-sm flex-row items-center">
                <View className="bg-blue-100 p-3 rounded-full mr-4">
                  <Award size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800">
                    Credit Repair
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Improve your credit score with our expert guidance.
                  </Text>
                </View>
              </View>

              <View className="bg-blue-50 p-6 rounded-xl shadow-sm flex-row items-center">
                <View className="bg-blue-100 p-3 rounded-full mr-4">
                  <TrendingUp size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800">
                    Financial Planning
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Plan your finances effectively with our tools and advice.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Testimonial section */}
          <View className="px-6 py-8 bg-gray-50">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
              What Our Clients Say
            </Text>
            <View className="bg-white p-6 rounded-xl shadow-md">
              <Text className="text-gray-600 italic text-center">
                "People's Credit Solution helped me improve my credit score by
                150 points in just 6 months. Their team was professional and
                supportive throughout."
              </Text>
              <Text className="text-gray-800 font-bold text-center mt-4">
                - Sarah Johnson
              </Text>
            </View>
          </View>

          {/* Footer Section */}
          <View className="bg-blue-600  px-6 py-8">
            <Text className="text-white text-center font-medium">
              © 2025 People's Credit Solution
            </Text>
            <Text className="text-blue-100 text-center text-sm mt-2">
              All rights reserved
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomePage;