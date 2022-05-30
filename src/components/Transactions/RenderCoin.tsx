import * as React from 'react';
import { StyleSheet } from 'react-native';
import { coinImagePath } from '../../../docs/config';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Image, Text, View } from 'native-base';

interface RenderCoinProps {
    tokenSymbol:string,
    tokenName:string,
    balance:string|number,
    index:number
}

const RenderCoin = (props: RenderCoinProps) => {

    const {
        tokenSymbol,
        tokenName,
        balance,
        index
    } = props
    return (
        <View
            style={{
            height: hp('4.9%'),
            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',
            justifyContent: 'center',
            padding: null,
            }}>
            <View style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
                <View
                    style={{
                    flex: 0.2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}>
                    <Image source={coinImagePath} style={styles.tokenIconStyle} />

                    <Text
                    style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: hp('1.97%'),
                        color: '#000000',
                    }}>
                    {tokenSymbol}
                    </Text>
                </View>
                <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                    style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: hp('1.97%'),
                        color: '#000000',
                    }}>
                    {tokenName}
                    </Text>
                </View>
                <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                    style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: hp('1.97%'),
                        color: '#000000',
                    }}>
                    {parseFloat(balance).toFixed(0)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default RenderCoin;

const styles = StyleSheet.create({
    tokenIconStyle: {
        height: hp('3%'),
        width: hp('3%'),
    },
});