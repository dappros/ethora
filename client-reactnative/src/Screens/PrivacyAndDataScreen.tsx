import {Text} from 'native-base';
import React, {useState} from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {commonColors, textStyles} from '../../docs/config';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {Blocking} from './Privacy/Blocking';
import {DocumentShares} from './Privacy/DocumentShares';
import {ManageData} from './Privacy/ManageData';
import {ProfileShare} from './Privacy/ProfileShare';
import {Visibility} from './Privacy/Visibility';
const renderTabBar = (props: any) => {
  return (
    <TabBar
      renderLabel={({route, focused}) => (
        <Text
          color={focused ? 'white' : 'info.200'}
          fontSize={10}
          fontFamily={textStyles.semiBoldFont}>
          {route.title}
        </Text>
      )}
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: commonColors.primaryDarkColor}}
    />
  );
};
export const PrivacyAndDataScreen = () => {
  const [routeIndex, setRouteIndex] = useState(0);

  const routes = [
    {key: 'visibility', title: 'Visibility'},
    {key: 'profileShares', title: 'Profile Shares'},
    {key: 'documentShares', title: 'Document Shares'},
    {key: 'blocking', title: 'Blocking'},
    {key: 'manageData', title: 'Manage Data'},
  ];

  return (
    <>
      <SecondaryHeader title={'Privacy and Data'} />
      <TabView
        swipeEnabled={false}
        renderTabBar={renderTabBar}
        navigationState={{
          index: routeIndex,
          routes: routes,
        }}
        renderScene={SceneMap({
          visibility: () => <Visibility />,
          profileShares: () => <ProfileShare />,
          documentShares: () => <DocumentShares />,
          blocking: () => <Blocking />,
          manageData: () => <ManageData />,
        })}
        onIndexChange={setRouteIndex}
        initialLayout={{width: widthPercentageToDP('100%')}}
      />
    </>
  );
};
