/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { useNavigation } from '@react-navigation/native';
import { 
    FlatList,
    HStack,
    Text,
    View
} from 'native-base';
import * as React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Animated
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { itemsTransfersAllowed, textStyles } from '../../../docs/config';
import { ROUTES } from '../../constants/routes';
import AssetSlider from '../Profile/AssetSlider';
import { NftListItem } from '../Transactions/NftListItem';
import RenderCoin from '../Transactions/RenderCoin';

interface AssetListProps {
    setActiveAssetTab:any,
    activeAssetTab:number,
    coinBalance:any,
    itemsBalance:any,
    coinData:any,
    itemsData:any,
    userWalletAddress:string
}

const AssetList = (props: AssetListProps) => {

    const navigation = useNavigation();

    const {
        setActiveAssetTab,
        activeAssetTab,
        coinBalance,
        itemsBalance,
        coinData,
        itemsData,
        userWalletAddress
    } = props

    //UI component handle for each item
    const RenderAssetItem = (
        {item, index, onClick, selectedItem}:
        {item:any, index:number, onClick:any, selectedItem:string}
        ) => (
        <NftListItem
          image={item.nftFileUrl}
          name={item.tokenName}
          assetsYouHave={item.balance}
          totalAssets={item.total}
          onClick={onClick}
          itemSelected={selectedItem}
          nftId={item.nftId}
          mimetype={item.nftMimetype}
          index={index} 
          item={undefined} 
        />
    );

    //UI component handle for each coin
    const renderCoinItem=({item, index}:{item:any,index:any}) => {
        return(
            <RenderCoin
                tokenSymbol={item.tokenSymbol}
                tokenName={item.tokenName}
                balance={item.balance}
                index={index}
            />
        )
    }

    return(
        <View 
        marginTop={hp('3%')}>
            <AssetSlider
                activeAssetTab={activeAssetTab}
                coinBalance={coinBalance}
                itemsBalance={itemsBalance}
                setActiveAssetTab={setActiveAssetTab}
            />
            <View style={{marginTop: hp('1.47%'), height: hp('43%')}}>
            {activeAssetTab === 0 ? (
              <FlatList
                data={coinData}
                nestedScrollEnabled={true}
                renderItem={renderCoinItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <FlatList
                data={itemsData}
                renderItem={e => (
                  <RenderAssetItem
                    item={e.item}
                    index={e.index}
                    onClick={() =>
                     navigation.navigate(ROUTES.NFTITEMHISTORY, {
                        screen: 'NftItemHistory',
                        params: {
                          item: e.item,
                          userWalletAddress: userWalletAddress,
                        },
                      })
                    }
                    selectedItem
                  />
                )}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        </View>
    )
};

export default AssetList;

const styles = StyleSheet.create({
  container: {}
});
