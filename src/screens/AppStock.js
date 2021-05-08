import React, { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import {
  Avatar,
  Title,
  FAB,
  Chip,
  Provider,
  Caption,
} from "react-native-paper";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";

function AppStock(props) {
  const [StockItems, setStockItems] = useState([]);

  const stockRef = firebase.firestore().collection("stockItems");

  useEffect(() => {
    stockRef.onSnapshot(
      (querySnapshot) => {
        const newStock = [];
        querySnapshot.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          newStock.push(shop);
        });
        setStockItems(newStock);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);
  return (
    <Provider>
      <View style={styles.screen}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />

        <FlatList
          data={StockItems}
          keyExtractor={(stock) => stock.id.toString()}
          renderItem={({ item }) => (
            <TouchableNativeFeedback
              onPress={(values) =>
                props.navigation.navigate("EditStockScreen", {
                  stockItem: {
                    id: item.id,
                    itemName: item.itemName,
                    stock: item.stock,
                    stockPrice: item.stockPrice,
                    unitPriceA: item.unitPriceA,
                    unitPriceB: item.unitPriceB,
                    unitPriceC: item.unitPriceC,
                  },
                })
              }
            >
              <View style={styles.card}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar.Icon
                      size={40}
                      icon="package-variant"
                      style={{ marginRight: "2%" }}
                    />
                    <Title style={styles.title}>{item.itemName}</Title>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      marginVertical: "5%",
                    }}
                  >
                    {AppRenderIf(
                      0 == item.stock,
                      <Chip
                        selectedColor={AppColors.red}
                        style={{ marginRight: "3%" }}
                        icon="circle"
                      >
                        Unavailable
                      </Chip>
                    )}
                    {AppRenderIf(
                      0 < item.stock,
                      <Chip
                        selectedColor={AppColors.green}
                        style={{ marginRight: "3%" }}
                        icon="circle"
                      >
                        Available
                      </Chip>
                    )}
                    {AppRenderIf(
                      10 < item.stock,
                      <Chip style={{ marginRight: "3%" }}>
                        තොගය: {item.stock}
                      </Chip>
                    )}
                    {AppRenderIf(
                      10 >= item.stock,
                      <Chip
                        selectedColor={AppColors.orange}
                        style={{ marginRight: "3%" }}
                      >
                        තොගය: {item.stock} (Low)
                      </Chip>
                    )}
                    <Chip>
                      <Caption style={{ fontSize: 8 }}>තොග මිල </Caption>Rs.
                      {item.stockPrice}
                    </Chip>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Chip>
                      <Caption style={{ fontSize: 8 }}>A කාණ්ඩය</Caption> Rs.
                      {item.unitPriceA}
                    </Chip>
                    <Chip>
                      <Caption style={{ fontSize: 8 }}>B කාණ්ඩය</Caption> Rs.
                      {item.unitPriceB}
                    </Chip>
                    <Chip>
                      <Caption style={{ fontSize: 8 }}>C කාණ්ඩය</Caption> Rs.
                      {item.unitPriceC}
                    </Chip>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          )}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => props.navigation.navigate("AddStockScreen")}
        />
      </View>
    </Provider>
  );
}

export default AppStock;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    marginHorizontal: "2%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "1%",
    borderRadius: 10,
    flexDirection: "row",
  },
  title: { fontSize: 16 },
  screen: { flex: 1 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.secondary,
  },
});
