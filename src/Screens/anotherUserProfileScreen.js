
import React, {useState, useEffect, useRef} from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
  StyleSheet
} from "react-native";
import TransactionListTab from '../components/TransactionListComponent';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from "react-redux";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomHeader from '../components/shared/customHeader';
import {commonColors, textStyles, coinImagePath} from '../../docs/config';

const {primaryColor, primaryDarkColor} = commonColors;
const {regularFont} = textStyles;

const handleSlide = (type, translateX, textColorAnim) => {
    textColorAnim.setValue(0);
    Animated.spring(translateX, {
      toValue: type,
      duration: 500,
      useNativeDriver: true
    }).start();
    Animated.timing(textColorAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true
    }).start();
};

const renderItem = ({item, index}) => (
    <Item
      tokenSymbol={item.tokenSymbol}
      tokenName={item.tokenName}
      balance={item.balance._hex?parseInt(item.balance._hex, 16):item.balance}
      index={index}
    />
);

const Item = ({tokenSymbol, tokenName, balance, index}) => (
    <View style={[styles.tabZeroContainerStyle,{backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',}]}>

      {/* Token Image and symbol container */}
      <View style={styles.tokenTextAndSymbolContainer}>
        <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center", alignSelf:"flex-start"}}>
          <Image source={coinImagePath} style={styles.tokenIconStyle} /> 
          <Text
            style={{
              fontFamily: regularFont,
              fontSize: hp('1.97%'),
              color: '#000000',
            }}>
            {" "}{tokenSymbol}
          </Text>
        </View>
      </View>

      {/* Token Name container */}
      <View style={styles.tokenNameContainer}>
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {tokenName}
        </Text>
      </View>

      {/* Token Balance container */}
      <View style={styles.tokenTextAndSymbolContainer}>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {parseFloat(balance).toFixed(2)}
        </Text>
      </View>

    </View>
);

const firstLayout = [
  {
      width: hp('10.46%'),
      height: hp('10.46%'),
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius:hp('10.46%') / 2
  },
  {
    flex: 1, marginTop: hp('5.5%'),
    children:[
      {
        paddingTop: hp('2.4%'),
        backgroundColor: '#FBFB7',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: hp('75%'),
      }
    ]
  }
];

const loadTabContent = (props) => {
    const {
        activeTab,
        coinData,
        anotherUserTransaction,
        anotherUserWalletAddress
    } = props;

    let updatedCoinBalance = 0;

    coinData?
    coinData.map(item=>{
      if(item.balance.hasOwnProperty("_hex")){
        updatedCoinBalance = updatedCoinBalance + parseInt(item.balance._hex,16);
      }else updatedCoinBalance = updatedCoinBalance + parseFloat(item.balance)
    }):null
    
    if (activeTab === 0) {
      return (
        <View style={{marginTop: hp('3%')}}>
          <View style={{padding: hp('3%'), paddingBottom: 0, paddingTop: 0}}>
            <Text
              style={{
                fontSize: hp('1.97'),
                color: '#000000',
                fontFamily: 'Montserrat-Bold',
              }}>
              Coins{' '}
              <Text
                style={{
                  fontSize: hp('1.47%'),
                  color: '#000000',
                  fontFamily: 'Montserrat-Medium',
                }}>
                ({parseFloat(updatedCoinBalance).toFixed(2)})
              </Text>
            </Text>
          </View>
          <View style={{marginTop: hp('1.47%')}}>
            <FlatList
              data={coinData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      );
    }

    if (activeTab === 1) {
      return (
        <TransactionListTab
          transactions={anotherUserTransaction}
          walletAddress={anotherUserWalletAddress}
        />
      );
    }
}

// function previousUserCheck(walletAddress){
//   const prevUserRef = useRef();
//   useEffect(()=>{
//     prevUserRef.current = loginReducerData.anotherUserWalletAddress
//   })
//   return prevUserRef.current
// }

function AnotherProfile(props){
    const allReducers = useSelector(state => state);
    const loginReducerData = allReducers.loginReducer;
    const walletReducerData = allReducers.walletReducer;
    // const prevUser = previousUserCheck(loginReducerData.anotherUserWalletAddress)
    const [isPreviousUser, setIsPreviousUser] = useState(loginReducerData.isPreviousUser);


    
    const [anotherUserAvatar, setAnotherUserAvatar] = 
      isPreviousUser?useState(loginReducerData.anotherUserAvatar)
      :useState(null);

    const [anotherUserFirstname, setAnotherUserFirstname] = 
      isPreviousUser?useState(loginReducerData.anotherUserFirstname)
      :useState("null");

    const [anotherUserLastname, setAnotherUserLastname] = 
      isPreviousUser?useState(loginReducerData.anotherUserLastname)
      :useState("null");

    const [anotherUserDescription, setAnotherUserDescription] =
      isPreviousUser?useState(loginReducerData.anotherUserDescription)
      :useState(null);

    const [anotherUserWalletAddress, setAnotherUserWalletAddress] =
      isPreviousUser?useState(loginReducerData.anotherUserWalletAddress)
      :useState(null);

    const [coinData, setCoinData] =
      isPreviousUser?useState(walletReducerData.anotherUserBalance)
      :useState(null);

    const [anotherUserTransaction, setAnotherUserTransaction] =
      isPreviousUser?useState(walletReducerData.anotherUserTransaction)
      :useState(null);
    
    const [transactionCount, setTransactionCount] =
      isPreviousUser?useState(walletReducerData.anotherUserTransaction.length)
      :useState(null);

    const [activeTab, setActiveTab] = useState(0);
    const [xTabOne, setXTabOne] = useState(0);
    const [xTabTwo, setXTabTwo] = useState(0);
    const [translateX, setTranslateX] = useState(new Animated.Value(0));
    const [textColorAnim, setTextColorAnim] = useState(new Animated.Value(0));

    const [isLoading, setIsLoading] =
      isPreviousUser?useState(false):
      useState(true);

    const [isLoadingVCard, setIsLoadingVCard] =
      isPreviousUser?useState(false):
      useState(true)

    const [assetCount, setAssetCount] =
      isPreviousUser?useState(walletReducerData.anotherUserBalance.length)
      :useState(1);

    useEffect(()=>{
        handleSlide(activeTab===0?xTabOne:xTabTwo,translateX,textColorAnim)
    },[activeTab])

    if(!isPreviousUser){
      useEffect(()=>{
        
        setTimeout(()=>{
          setAnotherUserWalletAddress(loginReducerData.anotherUserWalletAddress);
          setAnotherUserTransaction(walletReducerData.anotherUserTransaction);
          setTransactionCount(walletReducerData.anotherUserTransaction.length)
          setIsLoading(false);
        },1200)
        
      },[allReducers.walletReducer.anotherUserTransaction]);
      
      useEffect(()=>{
        setTimeout(()=>{
          if(walletReducerData.anotherUserBalance.length>0){
            setCoinData(walletReducerData.anotherUserBalance);
            setAssetCount(walletReducerData.anotherUserBalance.length)
          }
        },1200)

      },[allReducers.walletReducer.anotherUserBalance])

      useEffect(()=>{
        setTimeout(()=>{
          setAnotherUserAvatar(loginReducerData.anotherUserAvatar);
          setAnotherUserFirstname(loginReducerData.anotherUserFirstname);
          setAnotherUserLastname(loginReducerData.anotherUserLastname);
          setAnotherUserDescription(loginReducerData.anotherUserDescription);
          setIsLoadingVCard(false);
        }
        ,1200)
        
        
      },[allReducers.loginReducer.anotherUserAvatar])

    }

    useEffect(()=>{
      return function cleanup (){
        setAnotherUserAvatar(null);
        setAnotherUserFirstname('null');
        setAnotherUserLastname('null');
        setAnotherUserDescription(null);
        setAnotherUserWalletAddress(null);
        setCoinData(null);
        setAnotherUserTransaction(null);
        setTransactionCount(null);
        setIsLoading(true);
        setIsLoadingVCard(true);
        setIsPreviousUser(false)
      }
    },[])

    const {navigation} = props;

    return (
        <SafeAreaView style={styles.safeAreaViewStyle}>
          <View style={styles.mainContainerStyle}>
            <CustomHeader
              isQR={true}
              title="User's profile"
              onQRPressed={() => this.QRPressed()}
              navigation={navigation}
            />
          
            <View style={styles.profileMainContainerStyle}>
              <View
                style={[
                  styles.profileInnerContainerStyle,
                  {backgroundColor: isLoadingVCard?'white': primaryColor}
                ]}
                >
                <SkeletonContent containerStyle={{alignItems: 'center'}} layout={firstLayout} isLoading={isLoadingVCard}>
                {anotherUserAvatar?
                <Image source={{uri:anotherUserAvatar}} style={styles.profileImageStyle}/>:
                <Text
                  style={styles.profileImageInitialsTextStyle}>
                  {anotherUserFirstname[0] + anotherUserLastname[0]}
                </Text>
                }
                </SkeletonContent>
              </View>
            </View>

            <View style={styles.bodyMainContainerStyle}>
              <View style={styles.bodyInnerContainerStyle}>

                <View style={styles.nameAndDescriptionContainerStyle}>

                  <SkeletonContent
                  containerStyle={styles.profileNameSkeletonContainerStyle}
                  layout={[
                    { width: wp('30%'), height: hp('2.216%'), marginBottom: 6 },
                    ]}
                    isLoading={isLoadingVCard}
                  >
                    <Text
                      style={styles.profileNameTextStyle}>
                      {anotherUserFirstname} {anotherUserLastname}
                    </Text>
                  </SkeletonContent>

                  <View style={styles.descriptionContainerStyle}>
                    <SkeletonContent
                    containerStyle={styles.descriptionSkeletonContainerStyle}
                    layout={[
                      { width: wp('60%'), height: 70, marginBottom: 6 },
                      ]}
                      isLoading={isLoadingVCard}>
                      <Text style={styles.descriptionTextStyle}>
                        {anotherUserDescription}
                      </Text>
                    </SkeletonContent>
                  </View>

                </View>

                <View style={styles.contentContainerStyle}>
                  <SkeletonContent
                  isLoading={isLoading}
                  containerStyle={{width:'100%', alignItems:isLoading?'center':null}}
                    layout={[
                      { width: wp('90%'), height: hp('2.216%'), marginBottom: 6 },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onLayout={event =>
                          setXTabOne( event.nativeEvent.layout.x )
                        }
                        onPress={() => setActiveTab(0)}>

                        <Animated.Text
                          style={{
                            fontSize: hp('1.97%'),
                            fontFamily: 'Montserrat-Bold',
                            color:
                              activeTab === 0
                                ? '#000000'
                                : '#0000004D',
                          }}>
                          Assets ({assetCount})
                        </Animated.Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                      style={{marginLeft:20}}
                        onLayout={event =>
                          setXTabTwo(event.nativeEvent.layout.x)
                        }
                        onPress={() =>setActiveTab(1)}>
                        <Animated.Text
                          style={{
                            fontSize: hp('1.97%'),
                            fontFamily: 'Montserrat-Bold',
                            color:
                              activeTab === 1
                                ? '#000000'
                                : '#0000004D',
                          }}>
                          Transactions ({transactionCount})
                        </Animated.Text>
                      </TouchableOpacity>

                    </View>
                    </SkeletonContent>

                  {isLoading?null:<Animated.View
                    style={{
                      width: wp('10%'),
                      borderWidth: 1,
                      transform: [
                        {
                          translateX,
                        },
                      ],
                    }}
                  />}
                </View>

                <SkeletonContent isLoading={isLoading} 
                containerStyle={{width:'100%',padding: isLoading?hp('3%'):null, alignItems:isLoading?'center':null}}
                  layout={[
                    { width: wp('90%'), height: hp('30%'), marginBottom: 6 },
                ]}>
                {loadTabContent({
                    activeTab,
                    coinData,
                    anotherUserTransaction,
                    anotherUserWalletAddress
                })}
                </SkeletonContent>

              </View>
            </View>
        </View>
      </SafeAreaView>
    )
}

export default AnotherProfile;

const styles = StyleSheet.create({
  tokenIconStyle:{
    height: hp("3%"),
    width: hp("3%")
  },
  tabZeroContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    height: hp('4.9%'),
  },
  tokenTextAndSymbolContainer:{
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tokenNameContainer:{
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: 'white'
  },
  mainContainerStyle: {
    backgroundColor: primaryDarkColor,
    flex: 1
  },
  profileMainContainerStyle: {
    zIndex: +1, alignItems: 'center'
  },
  profileInnerContainerStyle:{
    width: hp('10.46%'),
    height: hp('10.46%'),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:hp('10.46%') / 2
  },
  profileImageStyle: {
    height:hp("10.46%"),
    width:hp("10.46%"),
    borderRadius:hp('10.46%') / 2
  },
  profileImageInitialsTextStyle:{
    fontSize: 40,
    color: 'white',
  },
  bodyMainContainerStyle:{
    flex: 1,
    marginTop: hp('5.5%')
  },
  bodyInnerContainerStyle:{
    paddingTop: hp('2.4%'),
    backgroundColor: '#FBFBFB',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: hp('75%'),
  },
  profileNameSkeletonContainerStyle:{
    width: wp('100%'),
    alignItems:'center'
  },
  profileNameTextStyle:{
    fontSize: hp('2.216%'),
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
  },
  nameAndDescriptionContainerStyle:{
    alignItems: 'center',
    marginTop: hp('5.54%')
  },
  descriptionContainerStyle:{
    padding: hp('4%'),
    paddingBottom: 0,
    paddingTop: 0,
  },
  descriptionSkeletonContainerStyle:{
    width: wp('100%'),
    alignItems:'center'
  },
  descriptionTextStyle: {
    fontSize: hp('2.23%'),
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: primaryDarkColor,
  },
  contentContainerStyle:{
    padding: wp('4%')
  },
  contentSkeletonContainerStyle:{
    
  }
})