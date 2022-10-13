import {HStack, Text, VStack} from 'native-base';
import React, {Dispatch, SetStateAction} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import {commonColors, textStyles} from '../../../docs/config';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface IProfileShareManage {
  onAddPress: Dispatch<SetStateAction<number>>;
}

const items = [
  {
    createdAt: new Date().getTime(),
    name: 'Hello',
    expiresAt: new Date().getTime(),
  },
];

interface ILink {
  createdAt: number;
  name: string;
  expiresAt: number;
}

export const ProfileShareManage: React.FC<IProfileShareManage> = ({
  onAddPress,
}) => {
  const UserItem = ({item}: {item: ILink}) => (
    <HStack alignItems={'center'} justifyContent={'space-between'}>
      <VStack>
        <Text style={styles.linkName}>{item.name}</Text>
        <Text style={styles.linkDate}>Created at: {item.createdAt}</Text>
        <Text style={styles.linkDate}>Expires: {item.expiresAt}</Text>
      </VStack>
      <HStack>
        <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
          <AntDesignIcons name="qrcode" size={35} color={'black'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
          <AntDesignIcons name="copy1" size={35} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
          <MaterialIcons name="delete" size={35} color={'darkred'} />
        </TouchableOpacity>
      </HStack>
    </HStack>
  );
  const renderItem = ({item}: {item: ILink}) => <UserItem item={item} />;

  return (
    <VStack paddingX={5}>
      <View style={{marginTop: 10, marginBottom: 20}}>
        <HStack justifyContent={'space-between'} mb={5}>
          <Text style={styles.title}>Current Profile Shares</Text>
          <TouchableOpacity
            onPress={() => onAddPress(1)}
            style={styles.addButton}>
            <HStack alignItems={'center'}>
              <AntDesignIcons name="plus" color={'white'} size={20} />
              <Text style={{color: 'white', fontFamily: textStyles.mediumFont}}>
                Add a share
              </Text>
            </HStack>
          </TouchableOpacity>
        </HStack>
        <Text style={styles.description}>
          Listed below are your currently active profile sharing links. You can
          share or delete them.
        </Text>
      </View>
      <View style={{marginTop: 10}}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.createdAt.toString()}
        />
      </View>
    </VStack>
  );
};
const styles = StyleSheet.create({
  title: {
    fontFamily: textStyles.semiBoldFont,
    color: 'black',
    fontSize: 18,
    marginVertical: 5,
  },
  description: {
    fontFamily: textStyles.regularFont,
    color: 'black',
  },
  addButton: {
    backgroundColor: commonColors.primaryColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionButton: {
    marginRight: 5,
  },
  linkName: {
    color: 'black',
    width: '90%',
    fontFamily: textStyles.semiBoldFont,
    fontSize: 18,
  },
  linkDate: {
    fontFamily: textStyles.regularFont,
    color: 'black',
  },
});
