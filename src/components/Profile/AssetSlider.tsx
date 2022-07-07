/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { HStack, Text } from 'native-base';
import * as React from 'react';
import {TouchableOpacity, Animated } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { itemsTransfersAllowed, textStyles } from '../../../docs/config';

interface AssetSliderProps {
    setActiveAssetTab:any,
    activeAssetTab:number,
    coinBalance:string|number,
    itemsBalance:string|number
}

const AssetSlider = (props: AssetSliderProps) => {

    const {
        setActiveAssetTab,
        activeAssetTab,
        coinBalance,
        itemsBalance
    } = props

    return (
        <HStack>
            <TouchableOpacity
            onPress={()=>setActiveAssetTab(0)}
            style={{marginLeft: 20}}
            >

                <Animated.Text
                style={{
                    fontSize: hp('1.97%'),
                    fontFamily:textStyles.boldFont,
                    color: activeAssetTab === 0 ? '#000000' : '#0000004D',
                }}
                >
                    Coins{' '}
                </Animated.Text>
                <Text
                style={{
                    fontSize: hp('1.97%'),
                    color: activeAssetTab === 0 ? '#000000' : '#0000004D',
                    fontFamily:textStyles.boldFont,
                }}>
                ({parseFloat(coinBalance).toFixed(0)})
                </Text>
            </TouchableOpacity>
            {itemsTransfersAllowed && (
            <TouchableOpacity
                onPress={() => setActiveAssetTab(1)}>
                <Animated.Text
                style={{
                    fontSize: hp('1.97%'),
                    fontFamily:textStyles.boldFont,
                    color: activeAssetTab === 1 ? '#000000' : '#0000004D',
                }}>
                Items ({itemsBalance})
                </Animated.Text>
            </TouchableOpacity>
            )}
            
        </HStack>
    );
};

export default AssetSlider;
