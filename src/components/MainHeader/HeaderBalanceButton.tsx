import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {Box, Image, Spinner, Text, VStack} from 'native-base';
import {Pressable} from 'react-native';
import {ROUTES} from '../../constants/routes';
import {useStores} from '../../stores/context';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { coinImagePath } from '../../../docs/config';

export const HeaderBalanceButton = observer(() => {
  const {walletStore} = useStores();
  const navigation = useNavigation();
  const onButtonPress = () => {
    navigation.navigate(ROUTES.PROFILE);
  };
  return (
    <Box
      background={'white'}
      rounded={'sm'}
      alignItems={'center'}
      justifyContent={'center'}
      width={50}
      height={50}>
      <Pressable onPress={onButtonPress}>
        <Box>
          <Image
            alt="logo"
            style={{width: hp('3%'), height: hp('3%')}}
            source={coinImagePath}
          />
        </Box>
        <VStack alignItems="center">
          {walletStore.coinBalance?
            <Text>{walletStore.coinBalance}</Text>
            :<Spinner/>
          }
        </VStack>
      </Pressable>
    </Box>
  );
});
