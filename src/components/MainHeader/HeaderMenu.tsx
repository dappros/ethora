import {useNavigation} from '@react-navigation/native';
import {Box, Menu} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {ROUTES} from '../../constants/routes';
import Icon from 'react-native-vector-icons/Entypo';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { itemsMintingAllowed } from '../../../docs/config';
import { useStores } from '../../stores/context';

const menuItems = (debug: boolean) => [
  {value: ROUTES.NEWCHAT, label: 'New chat', visible: true},
  {value: ROUTES.PROFILE, label: 'My profile', visible: true},
  {value: ROUTES.TRANSACTIONS, label: 'Transactions', visible: true},
  // {value: 'settings', label: 'Settings', visible: true},
  {value: ROUTES.SCAN, label: 'Scan', visible: true},
  // {value: 'myQr', label: 'QR', visible: true},
  {value: ROUTES.MINT, label: 'Mint items', visible: itemsMintingAllowed},
  {value: ROUTES.ACCOUNT, label: 'Account', visible: true},
  {value: ROUTES.DEBUG, label: 'Debug', visible: debug},
  {value: ROUTES.LOGOUT, label: 'Logout', visible: true},
];

export const HeaderMenu = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const {
    loginStore,
    accountStore,
    apiStore,
    chatStore,
    debugStore,
    otherUserStore,
    transactionsStore,
    walletStore
  } = useStores()

  const toggleMenu = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const onMenuItemPress = (value:any) => {
      if(value===ROUTES.LOGOUT){
        // resetStore()
        // useStores().resetStore()
          // loginStore.logOut()
          loginStore.setInitialState()
          accountStore.setInitialState()

          chatStore.setInitialState()
          transactionsStore.setInitialState()
          walletStore.setInitialState()
          debugStore.setInitialState()
          otherUserStore.setInitialState()
          apiStore.setInitialState()
          loginStore.setInitialState()
      }else{
      navigation.navigate(value);
      }
  };
  return (
    <Box
      h="100%"
      w={50}
      alignItems="center"
      shadow={'9'}
      justifyContent={'center'}>
      <Menu
        isOpen={open}
        placement={'bottom'}
        onClose={() => setOpen(false)}
        trigger={triggerProps => {
          return (
            <TouchableOpacity
              {...triggerProps}
              style={{zIndex: 99999}}
              onPress={()=>toggleMenu()}
              accessibilityLabel="More options menu">
              <Icon name="menu" color="#FFFFFF" size={hp('3%')} />
            </TouchableOpacity>
          );
        }}>
        {menuItems(true).map(item => {
          if (!item.visible) return null;
          return (
            <Menu.Item
              onPress={() => onMenuItemPress(item.value)}
              key={item.label}>
              {item.label}
            </Menu.Item>
          );
        })}
      </Menu>
    </Box>
  );
};
