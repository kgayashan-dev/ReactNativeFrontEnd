import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import { ChevronDown, ChevronLeft, User } from "lucide-react-native";

import { X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import authUtils from "@/app/utils/authUtils";
import HeaderComponet from "@/components/Header";

// Define types
type ReceiptItem = {
  id: string;
  name: string;
  rentalAmount: number;
  payAmount?: number;
  due: number;
};

const MFReceiptList: React.FC = () => {
  const [totalAmount, setTotalAmount] = useState<string>("600000");
  const [isPayModalVisible, setPayModalVisible] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(
    null
  );
  const [payAmount, setPayAmount] = useState<string>("");
  const [receiptData, setReceiptData] = useState<ReceiptItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState<boolean>(false);

  const navigation = useNavigation();
  useEffect(() => {
    fetchReceiptData();
  }, []);

  const fetchReceiptData = async (isRefresh: boolean = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const sampleData: ReceiptItem[] = [
        {
          id: "CK00000001222",
          name: "Saman Perera",
          rentalAmount: 100000,
          payAmount: 20000,
          due: 0,
        },
        {
          id: "CK0000000124412",
          name: "Saman Perera",
          rentalAmount: 100000,
          payAmount: 20000,
          due: 0,
        },
        {
          id: "CK0000r012212",
          name: "Saman Perera",
          rentalAmount: 100000,
          payAmount: 20000,
          due: 0,
        },
        {
          id: "CK000000012213",
          name: "Kamal Silva",
          rentalAmount: 100000,
          due: 300000,
        },
        {
          id: "CK000000012214",
          name: "Nimal Fernando",
          rentalAmount: 100000,
          payAmount: 20000,
          due: 0,
        },
      ];
      setReceiptData(sampleData);
    } catch (err) {
      const errorMessage = "Failed to load receipt data. Please try again.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      console.error("Error fetching receipt data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchReceiptData(true);
  };

  const handlePayAmountEnter = async () => {
    if (!selectedReceipt) return;
    if (!payAmount || parseFloat(payAmount) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid payment amount.");
      return;
    }
    setIsUpdatingPayment(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updatedReceipts = receiptData.map((receipt) =>
        receipt.id === selectedReceipt.id
          ? { ...receipt, payAmount: parseFloat(payAmount) }
          : receipt
      );
      setReceiptData(updatedReceipts);
      setPayModalVisible(false);
      setPayAmount("");
      setSelectedReceipt(null);
      Alert.alert("Success", "Payment amount updated successfully.");
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to update payment amount. Please try again."
      );
      console.error("Error updating payment:", err);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleTotalAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setTotalAmount(numericValue);
  };

  const handleSave = async () => {
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid total amount.");
      return;
    }
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Total Amount Saved:", totalAmount);
      Alert.alert("Success", "Total amount saved successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to save total amount. Please try again.");
      console.error("Error saving total amount:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // check the user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = await authUtils.getUserToken();
      if (!token) {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  const handleBackPress = () => {
    Alert.alert("Confirm", "Are you sure you want to go back?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          if (router.canGoBack()) {
            navigation.goBack();
          } else {
            router.replace("/"); // Redirect to a default route
          }
        },
      },
    ]);
    navigation.goBack();
  };

  const logOut = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await authUtils.removeUserToken();
        },
      },
    ]);
    await authUtils.removeUserToken(); // these are not mandatory/ Reset the route as the developer uses web browser
    router.replace("/"); // // these are not mandatory/ Reset the route as the developer uses web browser
  };

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-gray-600 text-lg text-center">
        No receipt data available.
      </Text>
    </View>
  );

  const renderReceiptItem = ({ item }: { item: ReceiptItem }) => (
    <TouchableOpacity
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-3"
      onPress={() => {
        setSelectedReceipt(item);
        setPayModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center border-b border-gray-200 p-3">
        <Text className="text-sm font-medium text-gray-700">{item.id}</Text>
        <Text className="text-sm text-blue-600">{item.name}</Text>
      </View>
      <View className="p-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-gray-600">Rental Amount</Text>
          <Text className="text-sm text-red-600 font-semibold bg-red-400/30 px-2 rounded-full">
            {item.rentalAmount.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Due Amount</Text>
          <Text className="text-sm text-green-600 font-semibold bg-green-400/30 px-2 rounded-full">
            {item.due.toLocaleString()}
          </Text>
        </View>
        {item.payAmount !== undefined && (
          <View className="bg-orange-50 rounded mt-2 p-2">
            <Text className="text-orange-500 text-sm font-semibold text-center">
              Pay Amount - {item.payAmount.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <HeaderComponet
          activeLogBtn={true}
          title="MF Receipt"
          onBack={handleBackPress}
          logOut={logOut}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-600 text-base mt-3">
              Loading receipts...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-5">
            <Text className="text-red-600 text-lg text-center mb-5">
              {error}
            </Text>
            <TouchableOpacity
              className="bg-blue-600 py-2 px-5 rounded-md"
              onPress={() => fetchReceiptData()}
              activeOpacity={0.7}
            >
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={receiptData}
            renderItem={renderReceiptItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={renderEmptyList}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={["#2563EB"]}
                tintColor="#2563EB"
              />
            }
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View className="bg-white border-t border-gray-200 py-2 px-2 rounded-t-[50] ">
            <Text className="text-lg font-semibold text-center text-gray-800 mb-3 ">
              Total Amount
            </Text>
            <View className="border border-gray-300 rounded-full mb-2 px-4">
              <TextInput
                className="w-full py-3 text-gray-800"
                placeholder="Enter total amount"
                value={totalAmount}
                onChangeText={handleTotalAmountChange}
                keyboardType="number-pad"
                editable={!isSaving}
              />
            </View>
            <TouchableOpacity
              className={`py-4 rounded-lg items-center justify-center ${
                isSaving ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={isPayModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            if (!isUpdatingPayment) {
              setPayModalVisible(false);
              setSelectedReceipt(null);
              setPayAmount("");
            }
          }}
        >
          <View className="flex-1 bg-black/30  items-center justify-center p-4">
            <View className="bg-white rounded-lg w-full max-w-md p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-medium text-gray-900">
                  Enter Pay Amount
                </Text>
                {!isUpdatingPayment && (
                  <TouchableOpacity
                    onPress={() => {
                      setPayModalVisible(false);
                      setSelectedReceipt(null);
                      setPayAmount("");
                    }}
                  >
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-sm text-gray-500 mb-3">
                {selectedReceipt ? selectedReceipt.id : ""}
              </Text>

              <TextInput
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="Enter Pay Amount"
                keyboardType="number-pad"
                value={payAmount}
                onChangeText={(text) =>
                  setPayAmount(text.replace(/[^0-9]/g, ""))
                }
                editable={!isUpdatingPayment}
              />

              <TouchableOpacity
                className={`w-full py-3 rounded-md items-center mb-2 ${
                  isUpdatingPayment ? "bg-blue-400" : "bg-blue-600"
                }`}
                onPress={handlePayAmountEnter}
                disabled={isUpdatingPayment}
                activeOpacity={0.7}
              >
                {isUpdatingPayment ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-medium">Enter</Text>
                )}
              </TouchableOpacity>

              {!isUpdatingPayment && (
                <TouchableOpacity
                  className="w-full py-3 items-center rounded-md"
                  onPress={() => {
                    setPayModalVisible(false);
                    setSelectedReceipt(null);
                    setPayAmount("");
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-blue-600 font-medium">Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MFReceiptList;