/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {useNavigation} from '@react-navigation/native';
import {Box, Divider, Menu, Text, View} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {ROUTES} from '../../constants/routes';
import Icon from 'react-native-vector-icons/Entypo';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {itemsMintingAllowed, textStyles} from '../../../docs/config';
import {useStores} from '../../stores/context';
import SubMenu from './SubMenu';

export const HeaderMenu = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const {loginStore, debugStore} = useStores();

  const AccountMenuItems = [
    {value: ROUTES.PROFILE, label: 'My profile', visible: true},
    {value: ROUTES.TRANSACTIONS, label: 'Transactions', visible: true},
    {value: ROUTES.ACCOUNT, label: 'Account', visible: true},
    {value: ROUTES.INVITEFRIENDS, label: 'Enter code', visible: true},
    {value: ROUTES.SWIPERCHAT, label: 'Swiper', visible: true},

  ];

  const ActionsMenuItems = [
    {value: ROUTES.NEWCHAT, label: 'New chat', visible: true},
    {value: ROUTES.SCAN, label: 'Scan', visible: true},
    {value: ROUTES.MINT, label: 'Mint items', visible: itemsMintingAllowed},
  ];

  const SystemMenuItems = [
    {value: ROUTES.PRIVACY, label: 'Privacy And Data', visible: true},

    {value: ROUTES.DEBUG, label: 'Debug', visible: debugStore.debugMode},
    {value: ROUTES.LOGOUT, label: 'Logout', visible: true},
  ];

  const toggleMenu = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const onMenuItemPress = (value: any) => {
    if (value === ROUTES.LOGOUT) {
      loginStore.logOut();
    } else {
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
        w="190"
        isOpen={open}
        placement={'bottom'}
        onClose={() => setOpen(false)}
        trigger={triggerProps => {
          return (
            <TouchableOpacity
              {...triggerProps}
              style={{zIndex: 99999}}
              onPress={() => toggleMenu()}
              accessibilityLabel="More options menu">
              <Icon name="menu" color="#FFFFFF" size={hp('3%')} />
            </TouchableOpacity>
          );
        }}>
        <SubMenu
          title="ACCOUNT"
          menuItems={AccountMenuItems}
          onMenuItemPress={onMenuItemPress}
        />
        <Divider />
        <SubMenu
          title="ACTIONS"
          menuItems={ActionsMenuItems}
          onMenuItemPress={onMenuItemPress}
        />
        <Divider />
        <SubMenu
          title="SYSTEM"
          menuItems={SystemMenuItems}
          onMenuItemPress={onMenuItemPress}
        />
      </Menu>
    </Box>
  );
};
