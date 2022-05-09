import {Box, Text} from 'native-base';
import React from 'react';

export const TransactionsListitemDate = ({date}:any) => {
  return (
    <Box
      bg={'gray.500'}
      w={'100%'}
      h={5}
      justifyContent={'center'}
      alignItems={'center'}>
      <Text color={'white'}>{date}</Text>
    </Box>
  );
};
