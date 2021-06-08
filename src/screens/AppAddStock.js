import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableNativeFeedback
  ,Text
} from "react-native";
import {
  Button,
  TextInput,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Snackbar,
  Title,
  List ,
} from "react-native-paper";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppAddStock({navigation,route}) {

   const { stockcategory } = route.params;
   //const [category, setCategory] = React.useState("");

  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [itemName, setItemName] = React.useState("");
  const [stockPrice, setStockPrice] = React.useState("");
  const [unitPriceA, setUnitPriceA] = React.useState("");
  const [unitPriceB, setUnitPriceB] = React.useState("");
  const [unitPriceC, setUnitPriceC] = React.useState("");
  const [stock, setStock] = React.useState("");

  const stockRef = firebase.firestore().collection("stockItems");

  const onAddButtonPress = () => {

    if (itemName && itemName.length > 0) {
      const data = {
        itemName: itemName,
        stockPrice: stockPrice,
        unitPriceA: unitPriceA,
        unitPriceB: unitPriceB,
        unitPriceC: unitPriceC,
        stock: stock,
        category: stockcategory.name,
      };
      stockRef
        .add(data)
        .then((_doc) => {
          setItemName("");
          navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const [shops, setShops] = useState([]);

  const shopRef = firebase.firestore().collection("category");

  useEffect(() => {
    shopRef.onSnapshot(
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
      <View style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <ScrollView style={{ marginTop: "1%" }}>

          <TouchableNativeFeedback
          onPress={() => navigation.navigate("StockCategoryScreen") }
          >
        <View style={styles.card}>
        <View style={{marginTop:"-5%",marginLeft:"-7%"}}>
        <List.Icon icon="sitemap" />
        </View>
         <Title style={styles.title}>{stockcategory.name}</Title>
        </View>
          </TouchableNativeFeedback>

          <TextInput
            placeholder="භාණ්ඩයේ නම"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setItemName(text)}
            value={itemName}
            left={<TextInput.Icon name="package-variant" />}
          />
      
          <TextInput
            placeholder="තොග මිල"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setStockPrice(text)}
            value={stockPrice}
            keyboardType="number-pad"
            left={<TextInput.Icon name="cash" />}
          />
          <TextInput
            placeholder="ඒකක මිල - කාණ්ඩය A"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceA(text)}
            value={unitPriceA}
            keyboardType="number-pad"
            left={<TextInput.Icon name="alpha-a-box-outline" />}
          />
          <TextInput
            placeholder="ඒකක මිල - කාණ්ඩය B"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceB(text)}
            value={unitPriceB}
            keyboardType="number-pad"
            left={<TextInput.Icon name="alpha-b-box-outline" />}
          />
          <TextInput
            placeholder="ඒකක මිල - කාණ්ඩය C"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceC(text)}
            value={unitPriceC}
            keyboardType="number-pad"
            left={<TextInput.Icon name="alpha-c-box-outline" />}
          />
          <TextInput
            placeholder="තොග ප්‍රමාණය"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setStock(text)}
            value={stock}
            keyboardType="number-pad"
            left={<TextInput.Icon name="numeric-9-plus-box-multiple-outline" />}
          />
          <View style={{marginBottom:"5%"}}>

          </View>
      </ScrollView>
        <Button
          mode="contained"
          icon="check-circle"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          style={styles.button}
          onPress={showDialog}
        >
          ඇතුලත් කරන්න
        </Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>නිවේදනය</Dialog.Title>
            <Dialog.Content>
              <Paragraph>දත්ත එකතු කිරීම තහවුරු කරන්න</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                mode="contained"
                color={AppColors.red}
                onPress={hideDialog}
              >
                අවලංගු කරන්න
              </Button>
              <Button
                mode="contained"
                color={AppColors.secondaryVariant}
                onPress={() => {
                  hideDialog();
                  onToggleSnackBar();
                  onAddButtonPress();
                }}
              >
                තහවුරු කරන්න
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Snackbar
          visible={visibleSnack}
          onDismiss={onDismissSnackBar}
          action={{
            label: "හරි",
            onPress: () => {
              onDismissSnackBar();
              navigation.goBack();
            },
          }}
        >
          දත්ත එකතු කිරීම සාර්ථකයි
        </Snackbar>
   
      </View>
    </Provider>
  );
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: "center",
    paddingHorizontal: "5%",
  },
  innerFooter: { padding: "4%", marginTop: "5%" },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  button: {
    padding: "4%",
    marginVertical: "2%",
  },
  text: {
    color: AppColors.primary,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
  card: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 10,
    backgroundColor: AppColors.background,
    borderRadius: 6,
    width: "100%",
    alignSelf: "center",
    borderColor:"#000000",
    borderWidth:1,
    height:"12%"
  },
  title: { 
      fontSize: 18,
      marginLeft:"7%",
      marginTop:"-17%"
},
});

export default AppAddStock;
