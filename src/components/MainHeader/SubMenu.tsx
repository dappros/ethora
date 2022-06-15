import { Box, Menu, Text, View } from 'native-base';
import React from 'react';
import { textStyles } from '../../../docs/config';
import { subMenuTitle } from '../../constants/subMenuTitle';

interface SubMenuProps {
    title:string,
    menuItems:any,
    onMenuItemPress:any
}
const SubMenu = (props: SubMenuProps) => {

    const { 
        title,
        menuItems,
        onMenuItemPress
    } = props

    return(
        <Box
        padding={2}
        width={"100%"}
        >
            <Text
            fontFamily={textStyles.semiBoldFont}
            >
                {title}
            </Text>
            {menuItems.map((item:{value: string, label: string, visible: boolean}) => {
          if (!item.visible) return null;
          return (
            <Menu.Item
            _text={{
                fontFamily:textStyles.lightFont
            }}
            onPress={() => onMenuItemPress(item.value)}
            key={item.label}>
            {item.label}
            </Menu.Item>
          );
        })}
        </Box>
    )

};

export default SubMenu;
