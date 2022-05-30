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
    fontFamily={fontFamily?fontFamily:undefined}
    textTransform={'uppercase'}
    fontSize={fontSize?fontSize:undefined}
    w={wp('80%')}
    h={hp('5.91%')}
    leftIcon={leftIcon?leftIcon:undefined}
    >
      <Text color={color}>
        {label?label:"Button label"}
      </Text>
    </Button>
  );
};

export default SocialButton;
