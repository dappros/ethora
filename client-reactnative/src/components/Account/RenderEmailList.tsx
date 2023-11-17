/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { FlatList } from "native-base"
import * as React from "react"
import { Text, View, StyleSheet } from "react-native"
import EmailListItem from "./EmailListItem"

interface RenderEmailListProps {
  emailList: any
  deleteEmail: any
  setTooltipVisible: any
  tooltipVisible: boolean
}

const RenderEmailList = (props: RenderEmailListProps) => {
  const { emailList, deleteEmail, setTooltipVisible, tooltipVisible } = props
  return (
    <FlatList
      data={emailList}
      keyExtractor={(item: any) => item.email}
      renderItem={(item) => (
        <EmailListItem
          emailList={item}
          deleteEmail={deleteEmail}
          setTooltipVisible={setTooltipVisible}
          tooltipVisible={tooltipVisible}
        />
      )}
    />
  )
}

export default RenderEmailList

const styles = StyleSheet.create({
  container: {},
})
