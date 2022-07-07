/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Button, Text } from 'native-base';
import { ColorType } from 'native-base/lib/typescript/components/types';
import * as React from 'react';
import { GestureResponderEvent } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface SocialButtonProps {
  label?:string,
  color?:string,
  fontFamily?:string,
  fontSize?:number,
  leftIcon?:JSX.Element | JSX.Element[] | undefined
  bg?:ColorType,
  _pressed?:any,
  onPress?:((event: GestureResponderEvent) => void) | null | undefined
}

const SocialButton = (props: SocialButtonProps) => {
  const {
    label,
    color,
    fontFamily,
    fontSize,
    leftIcon,
    bg,
    _pressed,
    onPress
  } = props
  return (
    <Button
    onPress={onPress}
    _pressed={_pressed}
    bg={bg?bg:undefined}
    _text={{
        color:color?color:'black'
    }}
    colorScheme={'black'}
    textTransform={'uppercase'}
    fontSize={fontSize?fontSize:undefined}
    w={wp('80%')}
    h={hp('5.91%')}
    leftIcon={leftIcon?leftIcon:undefined}
    >
      <Text
      fontFamily={fontFamily?fontFamily:undefined}
      color={color}>
        {label?label:"Button label"}
      </Text>
    </Button>
  );
};

export default SocialButton;
