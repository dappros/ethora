import { FlatList } from 'native-base';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import EmailListItem from './EmailListItem';

interface RenderEmailListProps {
    emailList:any,
    deleteEmail:any,
    setTooltipVisible:any,
    tooltipVisible:boolean
}

const RenderEmailList = (props: RenderEmailListProps) => {
    const {
        emailList,
        deleteEmail,
        setTooltipVisible,
        tooltipVisible
    } = props
    return (
        <FlatList
        data={emailList}
        key={emailList.email}
        keyExtractor={emailList.email}
        renderItem={item => 
            <EmailListItem
            emailList={emailList}
            deleteEmail={deleteEmail}
            setTooltipVisible={setTooltipVisible}
            tooltipVisible={tooltipVisible}
            />
        }
    />
  );
};

export default RenderEmailList;

const styles = StyleSheet.create({
  container: {}
});
