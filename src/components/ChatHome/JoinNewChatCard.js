import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Card} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {commonColors, textStyles} from '../../../docs/config';

export const joinNewChatCard = () => {
  return (
    <View>
      <Card containerStyle={{borderRadius: 4}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.2}}>
            <View style={styles.iconContainer}>
              <MaterialIcon
                name="group"
                size={hp('4.06%')}
                style={{marginRight: hp('0.9%'), marginLeft: hp('0.4%')}}
                color={commonColors.primaryColor}
              />
            </View>
          </View>
          <View style={{flex: 0.8}}>
            <View>
              <Text style={styles.companyTitle}>Managing company</Text>
              <Text style={styles.companyDescription}>
                We are a group of blockchain expertsto help you in technical
                developmentand business queries.
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineButton}>
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
      {/* <ModalList 
                type="tokenTransfer"
                show={this.state.showModal}
                data={this.state.tokenDetails}
                closeModal={this.closeModal}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    height: hp('5.54%'),
    width: hp('5.54%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp('0.7%'),
  },
  companyTitle: {
    color: '#4C5264',
    fontFamily: textStyles.semiBoldFont,
    fontSize: hp('1.9%'),
  },
  companyDescription: {
    color: '#4C5264',
    fontFamily: textStyles.regularFont,
    fontSize: hp('1.6%'),
  },
  joinButton: {
    width: wp('25%'),
    height: hp('5%'),
    backgroundColor: commonColors.primaryColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  joinText: {
    color: '#FFFFFF',
    fontFamily: textStyles.regularFont,
    fontSize: hp('1.8%'),
  },
  declineButton: {
    width: wp('25%'),
    height: hp('5%'),
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  declineText: {
    color: '#FF0000',
    fontFamily: textStyles.regularFont,
    fontSize: hp('1.8%'),
  },
});
