import {Box, HStack, Pressable, Text} from 'native-base';
import React from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { commonColors } from '../../../docs/config';
import { FILTERS } from '../../constants/transactionsFilter';

const FilterButton = ({title, active, ...props}:any) => {
  const isButtonPressed = active.toLowerCase() === title.toLowerCase();
  return (
    <Pressable bg={isButtonPressed ? 'gray.200' : 'white'} {...props}>
      <Box w={'100%'} paddingX={'50'} paddingY={'5'}>
        <Text
          fontSize={hp('2.216%')}
          fontWeight={'bold'}
          color={commonColors.primaryColor}>
          {title}
        </Text>
      </Box>
    </Pressable>
  );
};

export const TransactionFilter = ({activeFilter, setActiveFilter}:any) => {
  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <FilterButton
        onPress={() => setActiveFilter(FILTERS.all)}
        active={activeFilter}
        title={'All'}
      />
      <FilterButton
        onPress={() => setActiveFilter(FILTERS.sent)}
        active={activeFilter}
        title={'Sent'}
      />
      <FilterButton
        onPress={() => setActiveFilter(FILTERS.received)}
        active={activeFilter}
        title={'Received'}
      />
    </HStack>
  );
};
