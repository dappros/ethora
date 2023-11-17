/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box, Menu, Text, View } from "native-base"
import React from "react"
import { textStyles } from "../../../docs/config"
import { IMenuItem } from "./HeaderMenu"

interface SubMenuProps {
  title: string
  menuItems: IMenuItem[]
  onMenuItemPress: (value: string) => void
}
const SubMenu = (props: SubMenuProps) => {
  const { title, menuItems, onMenuItemPress } = props

  return (
    <Box padding={2} width={"100%"}>
      <Text fontFamily={textStyles.semiBoldFont}>{title}</Text>
      {menuItems.map(
        (item: {
          value: string
          label: string
          visible: boolean
          testID: string
        }) => {
          if (!item.visible) return null
          return (
            <Menu.Item
              accessibilityLabel={item.label}
              _text={{
                fontFamily: textStyles.lightFont,
              }}
              testID={item.testID}
              onPress={() => onMenuItemPress(item.value)}
              key={item.label}
            >
              {item.label}
            </Menu.Item>
          )
        }
      )}
    </Box>
  )
}

export default SubMenu
