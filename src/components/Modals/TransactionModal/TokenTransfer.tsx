import React,{Fragment} from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import { coinImagePath, textStyles } from '../../../../docs/config';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

interface TokenTransferProps {
    name:string,
    tokenTransferFunc:any,
    tokenAmount:any
}

const TokenTransfer = (props: TokenTransferProps) => {
  return (
    <Fragment>
      <Text style={styles.tokenTransferHeaderText}>
        Reward{' '}
        <Text
          style={{
            fontFamily: textStyles.regularFont,
            fontSize: hp('1.5%'),
            fontWeight: 'bold',
          }}>
          {props.name}
        </Text>{' '}
        with coins
      </Text>
      <View style={styles.coinSetContainer}>
        <Pressable
          onPress={() => props.tokenTransferFunc(1)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 1 ? 1 : null,
            borderColor: props.tokenAmount === 1 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.iconStyle} />
          <Text>1</Text>
        </Pressable>

        <Pressable
          onPress={() => props.tokenTransferFunc(3)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 3 ? 1 : null,
            borderColor: props.tokenAmount === 3 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.iconStyle} />
          <Text>3</Text>
        </Pressable>

        <Pressable
          onPress={() => props.tokenTransferFunc(5)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 5 ? 1 : null,
            borderColor: props.tokenAmount === 5 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.iconStyle} />
          <Text>5</Text>
        </Pressable>

        <Pressable
          onPress={() => props.tokenTransferFunc(7)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 7 ? 1 : null,
            borderColor: props.tokenAmount === 7 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.iconStyle} />
          <Text>7</Text>
        </Pressable>
      </View>

      {/* <View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}>
        <TouchableOpacity onPress={()=>props.closeModal()} style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=>props.tokenTransferFunc()} style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
          <Text>OK</Text>
        </TouchableOpacity>
      </View> */}
    </Fragment>
  );
};

export default TokenTransfer;

const styles = StyleSheet.create({
    iconStyle: {
        height: hp('3%'),
        width: hp('3%'),
    },
    tokenTransferHeaderText: {
        fontFamily: textStyles.regularFont,
        fontSize: hp('1.5%'),
        margin: 5,
        textAlign: 'center',
    },
    coinSetContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
    },
});
