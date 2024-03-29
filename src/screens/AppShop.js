import React, { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import { Avatar, Title, Caption, FAB, Provider ,Appbar} from "react-native-paper";
import { firebase } from "../configs/Database";

import AppColors from "../configs/AppColors";

function AppShop({ navigation, route }) {
  const { area } = route.params;

  const [shops, setShops] = useState([]);

  const shopRef = firebase.firestore().collection("shops");

  useEffect(() => {
    shopRef.where("route","==",area.name)
    .onSnapshot(
      (querySnapshot) => {
        const newShops = [];
        querySnapshot.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          newShops.push(shop);
        });
        setShops(newShops);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Provider>
        <Appbar style={{ backgroundColor: AppColors.primary }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title="වෙළෙඳසැල්"
            subtitle={"ප්‍රදේශය :"+area.name}
          />
        </Appbar>
      <View style={styles.screen}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <FlatList
          data={shops}
          keyExtractor={(shop) => shop.id}
          renderItem={({ item }) => (
            <TouchableNativeFeedback
              onPress={(values) =>
                navigation.navigate("EditShopScreen", {
                  shop: {
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    route:item.route,
                  },
                })
              }
            >
              <View style={styles.card}>
                <Avatar.Icon size={40} icon="store" />
                <Title style={styles.title}>{item.name}</Title>
                <Caption>
                  මිල කාණ්ඩය:
                  <Caption style={{ textTransform: "uppercase" }}>
                    {item.category}
                  </Caption>
                </Caption>
              </View>
            </TouchableNativeFeedback>
          )}
        />

      </View>
    </Provider>
  );
}

export default AppShop;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "1%",
    borderRadius: 10,
    width: "60%",
    alignSelf: "center",
  },
  title: { fontSize: 16 },
  screen: { flex: 1, justifyContent: "center" },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.secondary,
  },
});
