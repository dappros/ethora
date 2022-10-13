import React, {useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {HStack, Input, Pressable, Text, View} from 'native-base';
import {commonColors, textStyles, unv_url} from '../../../docs/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useClipboard} from '@react-native-clipboard/clipboard';
import {Select} from 'native-base';

export interface IProfileShareAdd {}

const HOUR = 60 * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = WEEK * 28;

const ShareOrCopy = () => {
  const [data, setString] = useClipboard();
  return (
    <View alignItems={'center'}>
      <Pressable
        shadow={3}
        style={({pressed}) => [
          {
            backgroundColor: pressed
              ? '#1667e2'
              : commonColors.primaryDarkColor,
          },
        ]}
        height={wp('10%')}
        justifyContent="center"
        alignItems="center"
        bg={commonColors.primaryDarkColor}
        flexDirection="row"
        margin={5}
        marginBottom={2}
        borderRadius={5}
        onPress={() => {}}
        w={'80%'}>
        <Text style={styles.shareText}>Share QR</Text>
        <Ionicons size={hp('2%')} color={'#fff'} name="share-social" />
      </Pressable>

      <Text>Or copy link</Text>
      <Pressable
        shadow={2}
        height={wp('10%')}
        justifyContent="center"
        alignItems="center"
        bg={'#fff'}
        flexDirection="row"
        margin={5}
        marginTop={2}
        w={'80%'}
        borderRadius={5}
        onPress={() => setString(unv_url)}>
        <View flex={0.8}>
          <Text
            color={'#000'}
            overflow={'hidden'}
            fontFamily={textStyles.mediumFont}
            numberOfLines={1}>
            {' '}
            {unv_url}
          </Text>
        </View>

        <View
          flex={0.2}
          bg={commonColors.primaryDarkColor}
          w={wp('18%')}
          h={wp('9%')}
          borderRadius={5}
          justifyContent={'center'}
          alignItems={'center'}
          shadow={1}
          margin={1}>
          <Text color={'#fff'} fontFamily={textStyles.mediumFont}>
            Copy
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export const ProfileShareAdd: React.FC<IProfileShareAdd> = ({}) => {
  const [memo, setMemo] = useState('');
  const [expiration, setExpiration] = useState('');

  return (
    <ScrollView
      style={{backgroundColor: 'white', paddingHorizontal: 20, flex: 1}}>
      <View style={{marginTop: 10}}>
        <HStack justifyContent={'space-between'}>
          <Text style={styles.title}>Create a Profile Sharing link</Text>
        </HStack>
        <Text style={styles.description}>
          Send this link to your trusted contact(s) so they can access your
          profile when you're in Restricted mode..
        </Text>
        <Text style={styles.note}>
          Note: you'll be able to remove this link any time if you change your
          mind.
        </Text>
      </View>
      <View>
        <Text style={styles.title}>Expiration</Text>

        <Text marginBottom={1}>
          If you set this, this link will only be valid for the given period of
          time.
        </Text>
        <Select
          selectedValue={expiration}
          minWidth="200"
          accessibilityLabel="Choose Expiration"
          placeholder="Choose Expiration"
          borderColor={commonColors.primaryColor}
          color={commonColors.primaryColor}
          mt={1}
          onValueChange={itemValue => setExpiration(itemValue)}>
          <Select.Item label="No Expiration" value={Infinity.toString()} />
          <Select.Item label="1 hour" value={HOUR.toString()} />
          <Select.Item label="1 day" value={DAY.toString()} />
          <Select.Item label="1 week" value={WEEK.toString()} />
          <Select.Item label="1 month" value={MONTH.toString()} />
        </Select>
      </View>
      <View>
        <Text style={styles.title}>Memo</Text>
        <Text>
          Add an optional note so that you remember who you shared this with.
        </Text>
        <Input
          maxLength={30}
          marginBottom={2}
          marginTop={1}
          fontFamily={textStyles.lightFont}
          fontSize={hp('1.6%')}
          color={'black'}
          onChangeText={setMemo}
          value={memo}
          placeholder={'shared with Alice'}
          placeholderTextColor={commonColors.primaryColor}
          borderColor={commonColors.primaryColor}
        />
      </View>
      <View>
        <Text style={styles.title}> Here you go!</Text>
        <Text>
          Your unique link and QR code have been created. You can share them
          using buttons below.
        </Text>
        <Text style={styles.note}>
          Note: use "Manage" tab in case you want to copy or modify your sharing
          link in future.
        </Text>
      </View>
      <ShareOrCopy />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  title: {
    fontFamily: textStyles.semiBoldFont,
    color: 'black',
    fontSize: 18,
    marginVertical: 10,
  },
  description: {
    fontFamily: textStyles.regularFont,
    color: 'black',
  },
  shareText: {
    color: '#fff',
    fontFamily: textStyles.mediumFont,
    // textAlign: 'center',
    fontSize: 18,
  },
  note: {
    color: 'black',
    marginTop: 5,
    fontStyle: 'italic',
    fontSize: 12,
  },
});
