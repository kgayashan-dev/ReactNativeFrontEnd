import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Keyboard,
  Modal,
} from "react-native";
import { Search } from "lucide-react-native";
import authUtils from "../utils/authUtils";
import { useNavigation } from "expo-router";

import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderComponet from "@/components/Header";

interface DropdownItem {
  label: string;
  value: string;
}

const MFReceipt = () => {
  // State management
  const [cashierBranch, setCashierBranch] = useState("");
  const [loanBranch, setLoanBranch] = useState("");
  const [center, setCenter] = useState("");
  const [grp, setGroup] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<{
    center?: string;
    search?: string;
    grp?: string;
  }>({});
  const [apiStatus, setApiStatus] = useState("idle");

  // Selected item display text
  const [cashierBranchText, setCashierBranchText] = useState("");
  const [loanBranchText, setLoanBranchText] = useState("");
  const [centerText, setCenterText] = useState("");
  const [groupText, setGroupText] = useState("");

  // Current active dropdown
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Search filters
  const [dropdownSearch, setDropdownSearch] = useState("");

  const router = useRouter();
  const navigation = useNavigation();
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = await authUtils.getUserToken();
      const userDataSet = await AsyncStorage.getItem("userData");

      if (userDataSet) {
        const userData = JSON.parse(userDataSet);
        setUserRole(userData.role);
        setUserId(userData.id);
      }

      if (!token) {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  // Simulate API call when center is selected
  useEffect(() => {
    if (center) {
      setApiStatus("loading");
      setTimeout(() => {
        setCashierBranch("branch1");
        setCashierBranchText("Branch 1");
        setLoanBranch("branchA");
        setLoanBranchText("Branch A");
        setApiStatus("success");
      }, 1000);
    }
  }, [center]);

  // Handle form submission
  const handleSubmit = () => {
    const newErrors: { center?: string; search?: string; grp?: string } = {};

    if (!center) {
      newErrors.center = "Please select a center";
    }
    if (!grp) {
      newErrors.grp = "Please select a group";
    }
    if (!searchQuery.trim()) {
      newErrors.search = "Please enter a username or ID";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiStatus("loading");

    // Simulate API call
    setTimeout(() => {
      const receiptData = {
        cashierBranch,
        loanBranch,
        center,
        searchQuery,
      };

      setApiStatus("success");
      Alert.alert("Success", "Receipt details fetched successfully");

      // Navigate to ReceiptList with data
      router.push({
        pathname: "/ReceiptList",
        params: { receiptData: JSON.stringify(receiptData) },
      });
    }, 1500);
  };

  // Handle back button
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

  // Dropdown data
  const cashierBranches = useMemo<DropdownItem[]>(
    () => [
      { label: "Branch 1", value: "branch1" },
      { label: "Branch 2", value: "branch2" },
    ],
    []
  );

  const loanBranches = useMemo<DropdownItem[]>(
    () => [
      { label: "Branch A", value: "branchA" },
      { label: "Branch B", value: "branchB" },
    ],
    []
  );

  const centers = useMemo<DropdownItem[]>(
    () => [
      { label: "Center 1", value: "center1" },
      { label: "Center 2", value: "center2" },
      { label: "Center 3", value: "center3" },
      { label: "Center 4", value: "center4" },
    ],
    []
  );

  const groups = useMemo<DropdownItem[]>(
    () => [
      { label: "Group 1", value: "grp1" },
      { label: "Group 2", value: "grp2" },
      { label: "Group 3", value: "grp3" },
      { label: "Group 4", value: "grp4" },
      { label: "Group 5", value: "grp5" },
      { label: "Group 6", value: "grp6" },
      { label: "Group 7", value: "grp7" },
      { label: "Group 8", value: "grp8" },
      { label: "Group 9", value: "grp9" },
      { label: "Group 10", value: "grp10" },
    ],
    []
  );

  // Get dropdown items based on active dropdown
  const getDropdownItems = (): DropdownItem[] => {
    const search = dropdownSearch.toLowerCase();

    switch (activeDropdown) {
      case "cashier":
        return cashierBranches.filter((item) =>
          item.label.toLowerCase().includes(search)
        );
      case "loan":
        return loanBranches.filter((item) =>
          item.label.toLowerCase().includes(search)
        );
      case "center":
        return centers.filter((item) =>
          item.label.toLowerCase().includes(search)
        );
      case "group":
        return groups.filter((item) =>
          item.label.toLowerCase().includes(search)
        );
      default:
        return [];
    }
  };

  // Handle dropdown item selection
  const handleSelectItem = (item: DropdownItem) => {
    switch (activeDropdown) {
      case "cashier":
        setCashierBranch(item.value);
        setCashierBranchText(item.label);
        break;
      case "loan":
        setLoanBranch(item.value);
        setLoanBranchText(item.label);
        break;
      case "center":
        setCenter(item.value);
        setCenterText(item.label);
        if (errors.center) setErrors({ ...errors, center: undefined });
        break;
      case "group":
        setGroup(item.value);
        setGroupText(item.label);
        if (errors.grp) setErrors({ ...errors, grp: undefined });
        break;
    }

    closeDropdown();
  };

  // Open dropdown
  const openDropdown = (type: string) => {
    setActiveDropdown(type);
    setDropdownSearch("");
    Keyboard.dismiss();
  };

  // Close dropdown
  const closeDropdown = () => {
    setActiveDropdown(null);
    setDropdownSearch("");
  };

  // Render field with selection UI
  const renderSelectField = (
    label: string,
    placeholder: string,
    value: string,
    type: string,
    error?: string
  ) => {
    return (
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">{label}</Text>
        <TouchableOpacity
          onPress={() => openDropdown(type)}
          className={`w-full relative border rounded-lg ${
            error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
          }`}
          activeOpacity={0.7}
        >
          <View className="absolute top-0 left-3 h-full flex justify-center items-center">
            <Search size={18} color="#4B5563" />
          </View>
          <Text
            className={`py-3 pl-10 pr-4 text-sm ${
              value ? "text-black" : "text-gray-400"
            }`}
          >
            {value || placeholder}
          </Text>
        </TouchableOpacity>
        {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          <HeaderComponet
            title="MF Receipt"
            onBack={handleBackPress}
            logOut={logOut}
            activeLogBtn={true}
          />

          <ScrollView className="flex-1">
            <View className="p-5">
              <View className="bg-blue-50 p-3 rounded-lg mb-6">
                <Text className="text-blue-800 text-xs">
                  Select the options below to view available receipts. Start by
                  selecting a center.
                </Text>
                <Text className="text-xs font-semibold mt-1">{userId}</Text>
              </View>

              {/* Dropdowns */}
              {renderSelectField(
                "Select Cashier Branch",
                "Search for cashier branch",
                cashierBranchText,
                "cashier"
              )}

              {renderSelectField(
                "Select Loan Branch",
                "Search for loan branch",
                loanBranchText,
                "loan"
              )}

              {renderSelectField(
                "Select Center",
                "Search for center",
                centerText,
                "center",
                errors.center
              )}

              {renderSelectField(
                "Select Group",
                "Search for group",
                groupText,
                "group",
                errors.grp
              )}

              {/* Search Input */}
              <View className="mb-6">
                <Text className="text-sm font-medium mb-2">
                  Enter ID/Account Number
                </Text>
                <View className="relative">
                  <View className="absolute top-0 left-3 h-full flex justify-center items-center">
                    <Search size={18} color="#4B5563" />
                  </View>
                  <TextInput
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm ${
                      errors.search
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    } ${
                      apiStatus === "loading" ? "opacity-70" : "opacity-100"
                    }`}
                    placeholder="Enter ID or name to search"
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      if (errors.search) {
                        setErrors({ ...errors, search: undefined });
                      }
                    }}
                    editable={apiStatus !== "loading"}
                  />
                </View>
                {errors.search && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.search}
                  </Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={apiStatus === "loading"}
                className={`w-full mt-4 py-4 rounded-lg flex items-center justify-center ${
                  apiStatus === "loading"
                    ? "bg-blue-400"
                    : "bg-blue-600 active:bg-blue-700"
                }`}
              >
                {apiStatus === "loading" ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text className="text-white font-bold ml-2">
                      Processing...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold">Fetch Receipts</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Dropdown Modal */}
          <Modal
            visible={activeDropdown !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={closeDropdown}
          >
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
              activeOpacity={1}
              onPress={closeDropdown}
            >
              <View className="m-4 mt-20 bg-white rounded-lg overflow-hidden">
                <View className="p-4 border-b border-gray-200">
                  <Text className="font-bold text-lg">
                    {activeDropdown === "cashier" && "Select Cashier Branch"}
                    {activeDropdown === "loan" && "Select Loan Branch"}
                    {activeDropdown === "center" && "Select Center"}
                    {activeDropdown === "group" && "Select Group"}
                  </Text>
                </View>

                <View className="p-4">
                  <View className="relative mb-4">
                    <View className="absolute top-0 left-3 h-full flex justify-center items-center">
                      <Search size={18} color="#4B5563" />
                    </View>
                    <TextInput
                      className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm border-gray-300"
                      placeholder="Search..."
                      value={dropdownSearch}
                      onChangeText={setDropdownSearch}
                      autoFocus
                    />
                  </View>

                  <FlatList
                    data={getDropdownItems()}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="px-4 py-3 border-b border-gray-100 active:bg-blue-100"
                        onPress={() => handleSelectItem(item)}
                      >
                        <Text className="text-sm">{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                      <View className="py-8 flex items-center">
                        <Text className="text-gray-500">No results found</Text>
                      </View>
                    }
                    style={{ maxHeight: 300 }}
                  />
                </View>

                <View className="p-4 border-t border-gray-200">
                  <TouchableOpacity
                    className="py-3 bg-blue-600 rounded-lg items-center"
                    onPress={closeDropdown}
                  >
                    <Text className="text-white font-bold">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MFReceipt;