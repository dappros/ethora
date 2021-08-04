import { View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {textStyles} from '../../../docs/config';

const screenNameArray=["screen0","screen1","screen2","screen3","common"]
const {
lightFont,
boldFont,
} = textStyles



export const screen0 = ()=>{
    return(
        <View>
            <View style={styles[screenNameArray[4]].subHeaderContainer}>
                <Text style={styles[screenNameArray[4]].subHeaderStyle}>
                This app allows you to join chat rooms and communicate with other users.
                </Text>
            </View>

            <View style={styles[screenNameArray[0]].leftSideTextContainer}>
                <View style={{width:wp("74.66%"), height:hp("11.08%"), justifyContent:"center"}}>
                    <Text style={styles[screenNameArray[0]].sideTextStyle}>
                    You will help promote the ecosystem by posting useful and engaging information that is relevant to the topic of the rooms and conversations.
                    </Text>
                </View>
            </View>

            <View style={styles[screenNameArray[0]].rightSideTextContainer}>
                <View style={{width:wp("77.66%"), height:hp("16.99%"), justifyContent:"center", alignItems:"flex-end"}}>
                    <Text style={styles[screenNameArray[0]].sideTextStyle}>
                    To keep you up to date with the latestcommunication you will receivePush Notification alerts for new messagesin the rooms you are subscribed to.You can disable this in the systemsettings of your device.
                    </Text>
                </View>
            </View>

            <View style={styles[screenNameArray[0]].imageContainer}>
                <Image style={styles[screenNameArray[0]].imageStyle} source={require("../../assets/slide1Img1.png")} />
            </View>
        </View>
    )
}

export const screen1 = ()=>{
    return(
        <View style={styles[screenNameArray[1]].container}>

            <View style={styles[screenNameArray[4]].subHeaderContainer}>
                <Text style={styles[screenNameArray[4]].subHeaderStyle}>
                This app allows you to join chat rooms and communicate with other users.
                </Text>
            </View>

            <View style={styles[screenNameArray[1]].view1Container}>
                <View style={styles[screenNameArray[1]].subView1Container}>
                    <Text style={styles[screenNameArray[1]].view1TextStyles}>
                    1. Find a QR code icon in thetop right corner of your chat room
                    </Text>
                </View>

                <View style={styles[screenNameArray[1]].imageContainer1}>
                    <Image source={require("../../assets/slide2Img1.png")} style={styles[screenNameArray[1]].imageStyle1}/>
                </View>
            </View>

            <View style={styles[screenNameArray[1]].view2Container}>
                <View style={styles[screenNameArray[1]].subView2Container}>
                    <Text style={styles[screenNameArray[1]].view2TextStyles}>
                    2. Hit share button
                    </Text>
                </View>

                <View style={styles[screenNameArray[1]].imageContainer2}>
                    <Image source={require("../../assets/slide2Img2.png")} style={styles[screenNameArray[1]].imageStyle2}/>
                </View>
            </View>

            <View style={styles[screenNameArray[1]].view3Container}>
                <View style={styles[screenNameArray[1]].subView3Container}>
                    <Text style={styles[screenNameArray[1]].view3TextStyles}>
                    3. Use system menu to share the QR codeover social media or in an e-mail.
                    </Text>
                </View>

                <View style={styles[screenNameArray[1]].imageContainer3}>
                    <Image source={require("../../assets/slide2Img3.png")} style={styles[screenNameArray[1]].imageStyle3}/>
                </View>
            </View>

            <View style={styles[screenNameArray[1]].finalTextContainer}>
                <Text style={styles[screenNameArray[1]].finalTextStyle}>
                Every user who scans your QR code with this appwill automatically join your chat.QR codes can alsobe printed, displayed in a Zoom call or in a TV ad, orsimply scanned from the screen of your phone.
                </Text>
            </View>

        </View>
    )
}

export const screen2 = ()=>{
    return(
        <View>
            <View style={styles[screenNameArray[4]].subHeaderContainer}>
                <Text style={styles[screenNameArray[4]].subHeaderStyle}>
                Every user in this app isequipped with a blockchain wallet.
                </Text>
            </View>

            
            <View style={[styles[screenNameArray[0]].leftSideTextContainer,{alignItems:"flex-start"}]}>
                <View style={{width:wp("74.66%"), height:hp("11.08%"), justifyContent:"center"}}>
                    <Text style={styles[screenNameArray[0]].sideTextStyle}>
                    You can store, receive and send tokens.These are digital assets protected byimmutable cryptographic ledger,or, in simple words, same protectionlevel as Bitcoin! 
                    </Text>
                </View>
            </View>

            <View style={{alignItems:"center"}}>
                <View style={styles[screenNameArray[2]].view1Container}>
                    <View style={styles[screenNameArray[2]].subView1Container}>
                        <Text style={styles[screenNameArray[2]].view1TextStyles}>
                        1. Your balance is shown in the top navigation bar
                        </Text>
                    </View>

                    <View style={styles[screenNameArray[2]].imageContainer1}>
                        <Image source={require("../../assets/slide3Img1.png")} style={styles[screenNameArray[2]].imageStyle1}/>
                    </View>
                </View>

                <View style={styles[screenNameArray[2]].view2Container}>
                    <View style={styles[screenNameArray[2]].subView2Container}>
                        <Text style={styles[screenNameArray[2]].view2TextStyles}>
                        2. To view historic transactions and all types of Tokens, go to Transactions screen
                        </Text>
                    </View>

                    <View style={styles[screenNameArray[2]].imageContainer2}>
                        <Image source={require("../../assets/slide3Img2.png")} style={styles[screenNameArray[2]].imageStyle2}/>
                    </View>
                </View>

                <View style={styles[screenNameArray[1]].finalTextContainer}>
                    <Text style={styles[screenNameArray[1]].finalTextStyle}>
                    The tokens can be used for many purposesin our ecosystem.For example, you can receive tokensfor sharing knowledge with other users.
                    </Text>
                </View>
            </View>
        </View>
    )
}

export const screen3 = ()=>{
    return(
        <View style={styles[screenNameArray[1]].container}>

            <View style={styles[screenNameArray[4]].subHeaderContainer}>
                <Text style={styles[screenNameArray[4]].subHeaderStyle}>
                Do you think somebody has shareda valuable piece of knowledge?
                <Text style={[styles[screenNameArray[4]].subHeaderStyle,{fontSize:hp("1.47%"), fontFamily:"Montserrat-Regular"}]}>Love a message and want to reward its author?Send them a few tokens, it’s simple:</Text>
                </Text>
            </View>

            <View style={styles[screenNameArray[3]].view1Container}>
                <View style={styles[screenNameArray[1]].subView1Container}>
                    <Text style={styles[screenNameArray[1]].view1TextStyles}>
                    1. Long tap on a message you like
                    </Text>
                </View>

                <View style={styles[screenNameArray[3]].imageContainer1}>
                    <Image source={require("../../assets/slide4Img1.png")} style={styles[screenNameArray[3]].imageStyle1}/>
                </View>
            </View>

            <View style={styles[screenNameArray[3]].view2Container}>
                <View style={styles[screenNameArray[1]].subView2Container}>
                    <Text style={styles[screenNameArray[1]].view2TextStyles}>
                    2. Choose the amount of tokensto send to the message
                    </Text>
                </View>

                <View style={styles[screenNameArray[3]].imageContainer2}>
                    <Image source={require("../../assets/slide4Img2.png")} style={styles[screenNameArray[3]].imageStyle2}/>
                </View>
            </View>

            <View style={styles[screenNameArray[1]].finalTextContainer}>
                <Text style={styles[screenNameArray[1]].finalTextStyle}>
                Done! You will see the message now displays theamount of tokens received. Its author will receivetokens right into their wallet.
                </Text>
                <View style={[styles[screenNameArray[1]].finalTextContainer,{marginTop:hp("2.46%"), marginBottom:hp("2.46%")}]}>
                <Text style={styles[screenNameArray[1]].finalTextStyle}>
                By rewarding useful contentyou are helping to <Text style={{color:"#F0B310"}}>make the community better.</Text>
                </Text>
            </View>
            </View>

            

        </View>
    )
}


const styles = 
{   common:StyleSheet.create({
        subHeaderStyle:{
            fontFamily:boldFont,
            fontSize:hp('1.97'),
            color:"#FFFFFF",
            textAlign:"center",
            marginTop:hp("2.4%")
        },
        subHeaderContainer:{
            marginLeft:wp("14.4%"),
            marginRight:wp("14.4%"),
            width:wp("79.46%")
        }
    }),
    screen0:StyleSheet.create({
        
        leftSideTextContainer:{
            marginTop:hp("2.7%"),
            marginBottom:hp("2.7%"),
            justifyContent:"center",
            paddingLeft:wp("6.13%"),
            width:wp("94.93%"),
            height:hp("21.92%"),
            backgroundColor:"#FFFFFF",
            paddingTop:hp("5.4%"),
            paddingBottom:hp("5.4%"),
            borderTopRightRadius:hp("10%"),
            borderBottomRightRadius:hp("10%"),
        },
        rightSideTextContainer:{
            alignSelf:"flex-end",
            marginBottom:hp("2.7%"),
            justifyContent:"center",
            paddingLeft:wp("6.13%"),
            width:wp("94.93%"),
            height:hp("21.92%"),
            backgroundColor:"#FFFFFF",
            paddingTop:hp("5.4%"),
            paddingBottom:hp("5.4%"),
            borderTopLeftRadius:hp("10%"),
            borderBottomLeftRadius:hp("10%"),
        },
        sideTextStyle:{
            fontFamily:lightFont,
            fontSize:hp("1.72%"),
            color:"#C59002"
        },
        imageContainer:{
            alignItems:"center"
        },
        imageStyle:{
            width:wp("65.46%"),
            height:hp("61.54%")
        }
    }),

    screen1:StyleSheet.create({
        container:{
            alignItems:'center'
        },
        view1Container:{
            justifyContent:'center',
            width:wp("88%"),
            height:hp("22.16%"),
            backgroundColor:"#00000033",
            marginTop:hp("1.84%"),
            marginBottom:hp("1.23%")
        },
        subView1Container:{
            height:hp("5.41%"),
            backgroundColor:"#00000033",
            justifyContent:'center',
            paddingLeft:wp("2.6%")
        },
        view1TextStyles:{
            fontFamily:lightFont,
            fontSize:hp("1.47%"),
            color:"#FFFFFF"
        },
        imageContainer1:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
        imageStyle1:{
            width:wp("75.73%"),
            height:hp("13.42%")
        },
        view2Container:{
            justifyContent:'center',
            width:wp("88%"),
            height:hp("31.15%"),
            backgroundColor:"#00000033",
            marginBottom:hp("1.23%")
        },
        subView2Container:{
            height:hp("5.41%"),
            backgroundColor:"#00000033",
            justifyContent:'center',
            paddingLeft:wp("2.6%")
        },
        view2TextStyles:{
            fontFamily:lightFont,
            fontSize:hp("1.47%"),
            color:"#FFFFFF"
        },
        imageContainer2:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
        imageStyle2:{
            width:wp("61.33%"),
            height:hp("23.64%")
        },
        view3Container:{
            justifyContent:'center',
            width:wp("88%"),
            height:hp("39.16%"),
            backgroundColor:"#00000033",
            marginBottom:hp("1.23%")
        },
        subView3Container:{
            height:hp("5.41%"),
            backgroundColor:"#00000033",
            justifyContent:'center',
            paddingLeft:wp("2.6%")
        },
        view3TextStyles:{
            fontFamily:lightFont,
            fontSize:hp("1.47%"),
            color:"#FFFFFF"
        },
        imageContainer3:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
        imageStyle3:{
            width:wp("51.46%"),
            height:hp("31.15%")
        },
        finalTextContainer:{
            width:wp("81.06%"),
            height:hp("11.08%"),
            marginTop:hp("2.4%"),
            marginBottom:hp("1.97%")
        },
        finalTextStyle:{
            fontFamily:lightFont,
            fontSize:hp("1.47%"),
            color:"#FFFFFF",
            textAlign:"center"
        }
    }),

    screen2:StyleSheet.create({
        view1Container:{
            justifyContent:'center',
            width:wp("88%"),
            height:hp("17.73%"),
            backgroundColor:"#00000033",
            marginBottom:hp("1.23%")
        },
        subView1Container:{
            height:hp("5.41%"),
            backgroundColor:"#00000033",
            justifyContent:'center',
            paddingLeft:wp("2.6%")
        },
        view1TextStyles:{
            fontFamily:lightFont,
            fontSize:hp("1.47%"),
            color:"#FFFFFF"
        },
        imageContainer1:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
        imageStyle1:{
            width:wp("78.4%"),
            height:hp("8.99%")
        },
        view2Container:{
            justifyContent:'center',
            width:wp("88%"),
            height:hp("35.96%"),
            backgroundColor:"#00000033",
            marginBottom:hp("1.23%")
        },
        subView2Container:{
            height:hp("5.41%"),
            backgroundColor:"#00000033",
            justifyContent:'center',
            paddingLeft:wp("2.6%")
        },
        view2TextStyles:{
            fontFamily:lightFont,
            fontSize:hp("1.47%"),
            color:"#FFFFFF"
        },
        imageContainer2:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
        imageStyle2:{
            width:wp("75.46%"),
            height:hp("26.47%")
        }
    }),

    screen3:StyleSheet.create({
        view1Container:{
            justifyContent:'center',
            width:wp("88%"),
            height:hp("38.54%"),
            backgroundColor:"#00000033",
            marginTop:hp("1.84%"),
            marginBottom:hp("1.23%")
        },
        imageContainer1:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
        imageStyle1:{
            width:wp("79.46%"),
            height:hp("29.80%")
        },
        view2Container:{
            justifyContent:'center',
            width:wp("88%"),
            height:hp("22.16%"),
            backgroundColor:"#00000033",
            marginTop:hp("1.84%"),
            marginBottom:hp("1.23%")
        },
        imageContainer2:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        },
        imageStyle2:{
            width:wp("66.93%"),
            height:hp("14.28%")
        }
    })
}