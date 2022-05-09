import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, HStack, Text} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { commonColors } from '../../../docs/config';

const SecondaryHeader = ({title = 'Go back'}) => {
  const navigation = useNavigation();
  const onArrowClick = () => {
    navigation.goBack();
  };
  return (
    <Box h={60} justifyContent={'center'} bg={commonColors.primaryDarkColor}>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <TouchableOpacity onPress={onArrowClick}>
          <Box flexDirection={'row'} alignItems={'center'}>
            <Icon
              name={'arrowleft'}
              style={{marginRight: 5, marginLeft: 5}}
              size={hp('3%')}
              color={'white'}
            />
            <Text fontSize={hp('2.2%')} color={'white'}>
              {title}
            </Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity style={{marginRight: 10}}>
          <FontAwesomeIcon name="qrcode" color="#FFFF" size={hp('3.7%')} />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

export default SecondaryHeader;
