import React, {useEffect} from 'react';
import {Alert, Image, Platform, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {coinImagePath, commonColors, textStyles} from '../../docs/config';
import {Button} from '../components/Button';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import {HStack} from 'native-base';
import {useIAP} from 'react-native-iap';
import * as RNIap from 'react-native-iap';

const products = [
  {name: '1k', value: 1, id: 'com.1'},
  {name: '25k', value: 25, id: 'com.25'},

  {name: '50k', value: 50, id: 'com.50'},
  {name: '100k', value: 100, id: 'com.100'},
];

const BuyCoinsItem = ({
  balance,
  buttonTitle,
  onPress,
}: {
  balance: number | string;
  buttonTitle: number | string;
  onPress: () => void;
}) => {
  return (
    <HStack justifyContent={'space-between'} style={{paddingVertical: 10}}>
      <HStack justifyContent={'center'}>
        <Image
          source={coinImagePath}
          style={{height: hp('4%'), width: hp('4%')}}
        />

        <Text style={{fontSize: hp('3%'), color: 'black'}}>{balance}</Text>
      </HStack>
      <Button
        title={buttonTitle.toString()}
        style={styles.submitButton}
        onPress={onPress}
      />
    </HStack>
  );
};

export interface ICoinPurchaseScreen {}

export const CoinPurchaseScreen: React.FC<ICoinPurchaseScreen> = ({}) => {
  const navigation = useNavigation();
  const {
    connected,
    promotedProductsIOS,
    subscriptions,
    purchaseHistories,
    availablePurchases,
    currentPurchase,
    currentPurchaseError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getAvailablePurchases,
    getPurchaseHistories,
    requestPurchase,
    initConnectionError
  } = useIAP();
  console.log(initConnectionError)
  const requestCoinPurchase = async () => {
    console.log(connected)
    try {
      const transaction = await requestPurchase({
        sku: 'com.hablar.buycoins_25',
        skus: ['com.hablar.buycoins_25']
      });
      console.log(transaction)
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView>
      <SecondaryHeader title={'Buy Coins'} />
      <View style={{paddingHorizontal: 16}}>
        <HStack>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: textStyles.regularFont,
            }}>
            Here you can purchase Coins. Use Coins to unlock features such as
            create your own "meta rooms" or purchase NFTs. You may also use
            Coins to reward other users (use them as "likes" in respond to
            useful chat messages etc).
          </Text>
        </HStack>

        <View style={{marginTop: 20}}>
          <Text
            style={{
              color: 'black',
              fontFamily: textStyles.regularFont,
            }}>
            Please choose how many coins you would like to purchase now:
          </Text>
          {products.map(item => (
            <BuyCoinsItem
              balance={item.name}
              buttonTitle={'$' + item.value}
              onPress={requestCoinPurchase}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: commonColors.primaryDarkColor,
    padding: 5,
    // width: widthPercentageToDP("40%"),
    // height: hp("5.7%"),
    borderRadius: 20,
    fontFamily: textStyles.mediumFont,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    // marginTop: 10,
  },
});
