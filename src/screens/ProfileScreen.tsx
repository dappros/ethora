import {observer} from 'mobx-react-lite';
import {Box, HStack, VStack} from 'native-base';
import React, {useState} from 'react';
import {Pressable, SafeAreaView} from 'react-native';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import TransactionsList from '../components/Transactions/TransactionsList';
import {UserProfileBlock} from '../components/Profile/UserProfileBlock';
import {UserProfileMainTabs} from '../components/Profile/UserProfileMainTabs';
import {useStores} from '../stores/context';
import { commonColors } from '../../docs/config';

const MAINTABS = {
  transactions: 'transactions',
  assets: 'assets',
};

const ProfileScreen = observer(() => {
  const {loginStore, transactionsStore} = useStores();
  const [activeMainTab, setActiveMainTab] = useState(MAINTABS.transactions);
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('1');

  const onMainTabPress = (tab:any) => {
    setActiveMainTab(tab);
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <SecondaryHeader title="My profile" />

      <Box bg={commonColors.primaryDarkColor}>
        <UserProfileBlock
          firstName={loginStore.initialData.firstName}
          lastName={loginStore.initialData.lastName}
          avatar={loginStore.userAvatar}
          description={loginStore.userDescription}
        />
        <VStack bg={'white'} pt={'10'}>
          <UserProfileMainTabs
            activeTab={activeMainTab}
            onTabPress={onMainTabPress}
          />
          <HStack>
            <Pressable />
          </HStack>
          {activeMainTab === MAINTABS.transactions && (
            <TransactionsList
              transactions={transactionsStore.transactions}
              boxHeight={'76%'}
            />
          )}
        </VStack>
      </Box>
    </SafeAreaView>
  );
});

export default ProfileScreen;