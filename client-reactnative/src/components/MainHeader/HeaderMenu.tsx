/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {useNavigation} from '@react-navigation/native';
import {Box, Divider, Menu} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  configDocuments,
  configNFT,
  itemsMintingAllowed,
} from '../../../docs/config';
import {useStores} from '../../stores/context';
import SubMenu from './SubMenu';
import {HomeStackNavigationProp} from '../../navigation/types';
import {homeStackRoutes} from '../../navigation/routes';

export interface IMenuItem {
  value: string;
  label: string;
  visible: boolean;
}
[];

const LOGOUT = 'LOGOUT';
export const HeaderMenu = () => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const [open, setOpen] = useState(false);

  const {loginStore, debugStore} = useStores();

  const AccountMenuItems: IMenuItem[] = [
    {value: homeStackRoutes.ProfileScreen, label: 'My profile', visible: true},
    {
      value: homeStackRoutes.TransactionsScreen,
      label: 'Transactions',
      visible: true,
    },
    // {value: homeStackRoutes.ACCOUNT, label: 'E-mails', visible: true},
    {
      value: homeStackRoutes.InviteFriendsScreen,
      label: 'Referrals',
      visible: true,
    },
    {
      value: homeStackRoutes.CoinPurchaseScreen,
      label: 'Buy coins',
      visible: true,
    },
  ];

  const ActionsMenuItems: IMenuItem[] = [
    {value: homeStackRoutes.NewChatScreen, label: 'New room', visible: true},
    {value: homeStackRoutes.ScanScreen, label: 'QR Scan', visible: true},
    {
      value: homeStackRoutes.MintScreen,
      label: 'Mint items',
      visible: itemsMintingAllowed && configNFT,
    },
    {
      value: homeStackRoutes.UploadDocumentsScreen,
      label: 'Upload Document',
      visible: configDocuments,
    },
  ];

  const SystemMenuItems: IMenuItem[] = [
    {
      value: homeStackRoutes.PrivacyAndDataScreen,
      label: 'Privacy and Data',
      visible: true,
    },
    {
      value: homeStackRoutes.AuthenticationScreen,
      label: 'Authentication',
      visible: true,
    },

    {
      value: homeStackRoutes.DebugScreen,
      label: 'Debug',
      visible: debugStore.debugMode,
    },
    {value: LOGOUT, label: 'Sign out', visible: true},
  ];

  const toggleMenu = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const onMenuItemPress = (value: string) => {
    if (value === LOGOUT) {
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
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.7,
        shadowRadius: 6.27,

        elevation: 10,
      }}
      justifyContent={'center'}>
      <Menu
        accessibilityLabel="Menu"
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
          title="ID"
          menuItems={SystemMenuItems}
          onMenuItemPress={onMenuItemPress}
        />
      </Menu>
    </Box>
  );
};
