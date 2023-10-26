import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BASIC_COLORS } from "../../utils/constants/styles";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MPSButton from "../../components/atoms/Button/Button";
import QrIcon from "../../assets/QrIcon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { axiosInstance } from "../../utils/common/api";

const ScannedDataDisplay = ({ route }) => {
  const { scannedData } = route.params;

  const inputValue = scannedData.join("\n");
  //scanned data

  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const [quantityInput, setQuantityInput] = useState("1");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleCardPress = (item) => {
    const quantity = parseInt(quantityInput, 10);
    if (!isNaN(quantity) && quantity > 0) {
      setSelectedProduct(item);
      const newItem = {
        itemName: item.name,
        quantity: quantity,
        unitPrice: item.price,
      };
      setItemsList([...itemsList, newItem]);
      ToastAndroid.show("Item added successfully!", ToastAndroid.SHORT);
    }
  };

  // Calculate the total based on itemsList
  const calculateTotal = () => {
    let total = 0;
    for (const item of itemsList) {
      total += item.quantity * item.unitPrice;
    }
    return total;
  };

  // Data get from the backend
  useEffect(() => {
    axiosInstance
      .get("/product")
      .then((response) => {
        console.log("Data received:");
        setProducts(response.data.data.data);
        setLoading(false);
        ToastAndroid.show("Data loaded successfully!", ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, []);

  // Search function
  const filterProducts = (products, searchQuery) => {
    return products.filter((product) => {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const filteredProducts = filterProducts(products, searchQuery);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.touchableCard}
      onPress={() => handleCardPress(item)}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>

      <View style={{ marginTop: 10 }}>
        <View style={styles.row}>
          <View style={styles.labelColumn}>
            <Text style={styles.labelText}>Unit Price</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.valueText}>Rs{item.price.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelColumn}>
            <Text style={styles.labelText}>Description</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.valueText}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelColumn}>
            <Text style={styles.labelText}>Quantity</Text>
          </View>
          <View style={styles.valueColumn}>
            {/* Bind the TextInput value to the quantityInput state variable */}
            <TextInput
              style={{
                backgroundColor: "#D8EFDD",
                paddingVertical: 2,
                paddingHorizontal: 9,
                width: 60,
                borderRadius: 8,
                color: BASIC_COLORS.FONT_SECONDARY,
              }}
              placeholder="Qty"
              value={quantityInput}
              onChangeText={(text) => setQuantityInput(text)} // Update the quantity input value
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    setTotalValue(calculateTotal());
  }, [itemsList]);

  //create order function
  const handleCheckout = () => {
    const orderItems = itemsList.map((item) => ({
      productID: item.productID,
      quantity: item.quantity,
    }));

    const amount = calculateTotal();
    const order = {
      products: orderItems,
      amount: amount,
      sellerID: "653015bdf8e3d113b78d3be5",
      creationDate: new Date().toISOString(),
    };

    axiosInstance
      .post("/order/", order)
      .then((response) => {
        console.log("Order created successfully:", response.data);
        ToastAndroid.show("Order created successfully!", ToastAndroid.SHORT);
        navigation.navigate("SalesSummaryScreen");
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={BASIC_COLORS.PRIMARY} />
      ) : (
        <View>




          <TextInput
            style={styles.inputField}
            placeholder="Enter scanned data"
            value={inputValue}
            onChangeText={(text) => setSearchQuery(text)}
          />
          {/* scanned data displaying */}
          <FlatList
            data={scannedData}
            renderItem={({ item }) => (
              <View style={styles.popupItem}>
                <Text style={styles.popupItemText}>QR code: {item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>


        




      )}



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 21,
  },
  inputField: {
    backgroundColor: "#D8EFDD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: BASIC_COLORS.FONT_SECONDARY,
    marginTop: 10,
  },
  // ...other styles
});

export default ScannedDataDisplay;