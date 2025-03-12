import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Home,
  ArrowBigLeft,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react-native";
import authUtils from "./utils/authUtils";

import { EXPO_PUBLIC_API_BASE_URL, TOKEN } from "@env";

const Login = () => {
  const fakeToken = process.env.TOKEN;
  const router = useRouter();

  // State management
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("idle"); // idle, loading, success, error
  const [networkAvailable, setNetworkAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate input fields
  const validateInputs = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
      // } else if (username.includes("@") && !isValidEmail(username)) {
      //   newErrors.username = "Invalid email format";
      //   isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 2) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle login with proper API integration
  const handleLogin = async () => {
    try {
      // const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/auth`, {
      const response = await fetch(`http://172.16.1.10:5246/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok) {
        console.log("Login Successful:", data);
        // Handle successful login (e.g., save token, navigate to another screen)
      } else {
        console.log("Login Failed:", data);
        // Handle failed login (e.g., show error message)
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle any unexpected errors
    }
  };

  // Handle retry when network is unavailable
  const handleRetry = () => {
    setNetworkAvailable(true);
    setErrorMessage("");
    setApiStatus("idle");
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Enter your email to receive password reset instructions",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: () =>
            Alert.alert("Success", "Password reset link sent to your email!"),
        },
      ]
    );
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header/Logo Section */}
          <View className="items-center mb-12">
            <View className="w-48 h-16 mb-8">
              <Image
                source={require("../assets/images/image.jpeg")}
                className="w-48 h-12 mb-2"
                resizeMode="contain"
              />
            </View>

            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-base">
              Please sign in to continue
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-5">
            {/* Global Error Message */}
            {errorMessage ? (
              <View className="bg-red-50 p-4 rounded-xl flex-row items-center">
                <AlertCircle size={20} color="#EF4444" className="mr-2" />
                <Text className="text-red-600 flex-1">{errorMessage}</Text>
              </View>
            ) : null}

            {/* Network Error */}
            {!networkAvailable ? (
              <View className="bg-yellow-50 p-4 rounded-xl">
                <Text className="text-yellow-800 mb-3">
                  No internet connection detected.
                </Text>
                <TouchableOpacity
                  className="bg-yellow-500 p-3 rounded-xl flex-row justify-center items-center"
                  onPress={handleRetry}
                >
                  <RefreshCw size={18} color="white" className="mr-2" />
                  <Text className="text-white font-medium">
                    Retry Connection
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Username Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">
                Username or Email
              </Text>
              <View
                className={`bg-white rounded-xl px-4 py-3 border ${
                  errors.username ? "border-red-400" : "border-gray-200"
                }`}
              >
                <TextInput
                  className="text-gray-800 text-base"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) {
                      setErrors({ ...errors, username: "" });
                    }
                  }}
                  placeholder="Enter your username or email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {errors.username ? (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                  {errors.username}
                </Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">
                Password
              </Text>
              <View
                className={`bg-white rounded-xl px-4 py-3 border ${
                  errors.password ? "border-red-400" : "border-gray-200"
                } flex-row items-center`}
              >
                <TextInput
                  className="text-gray-800 text-base flex-1"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={togglePasswordVisibility} className="p-1">
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </Pressable>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              className="items-end py-2"
              onPress={handleForgotPassword}
            >
              <Text className="text-blue-600 font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl mt-4 shadow-sm ${
                apiStatus === "loading" || !networkAvailable
                  ? "bg-blue-400"
                  : "bg-blue-600"
              } flex-row justify-center items-center`}
              onPress={handleLogin}
              disabled={apiStatus === "loading" || !networkAvailable}
            >
              {apiStatus === "loading" ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text className="text-white font-bold text-center text-lg mr-2">
                    Sign In
                  </Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Section */}
          <View className="flex-row justify-center mt-10">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
