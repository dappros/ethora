import React, {useEffect, useState} from 'react';
import {Share, StyleSheet, useWindowDimensions, View} from 'react-native';


import {commonColors, textStyles} from '../../docs/config';
import {showError, showSuccess} from '../components/Toast/toast';

import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {EnterInviteCode} from './EnterInviteCodeScreen';
import {ShareInviteLink} from './ShareInviteLinkScreen';
import {useStores} from '../stores/context';
import {observer} from 'mobx-react-lite';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';

export const InviteFriendsScreen = observer(({navigation}) => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'refer', title: 'Refer & Earn'},
    {key: 'code', title: 'Enter code'},
  ]);
  const layout = useWindowDimensions();

  const {loginStore} = useStores();
  const id = loginStore.initialData._id;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: id,
      });
    } catch (error) {
      showError('Error', 'Cannot share the link');
    }
  };

  return (
    <>
      <SecondaryHeader title={'Refer & Earn'} />

      <TabView
        navigationState={{index, routes}}
        renderTabBar={props => (
          <TabBar
            indicatorStyle={{backgroundColor: 'white'}}
            style={{backgroundColor: commonColors.primaryDarkColor}}
            {...props}
          />
        )}
        renderScene={SceneMap({
          refer: () => <ShareInviteLink link={id} onPressShare={onShare} />,
          code: () => <EnterInviteCode />,
        })}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </>
  );
});
