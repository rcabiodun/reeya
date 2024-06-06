import React ,{useRef, useState} from "react";
import { useEffect } from 'react';
import { View,Text,StyleSheet,StatusBar, Modal, TouchableOpacity, TextInput,SectionList,FlatList,ImageBackground, Animated} from 'react-native';
import { color_scheme } from "../colorscheme";



const getRandomMessage=()=>{
    const number=Math.trunc(Math.random()* 1000);
    return 'Random message'+number;

}

const Message =(props)=>{
    const opacity=useRef(new Animated.Value(0)).current;
    useEffect(()=>{
        Animated.sequence([
            Animated.timing(opacity,{
                toValue:1,
                duration:1000,
                useNativeDriver:true
            }),
            Animated.delay(3000),
            Animated.timing(opacity,{
                toValue:0,
                duration:1000,
                useNativeDriver:true
            }),
        ]).start(()=>props.onHide());

    },[])
    return(
        <Animated.View
            style={{
                opacity,
                transform:[
                    {
                        translateY:opacity.interpolate({
                            inputRange:[0,1],
                            outputRange:[-20,0],
                        })
                    }
                ],
                borderRadius:4,
                shadowColor:'transparent',
                height:50,
                alignItems:"center",
                justifyContent:'center',
                zIndex:5,
            }}
        >   
        <View style={{alignItems:'center',justifyContent:'center',backgroundColor:color_scheme.lightpurple,padding:7,marginLeft:10,borderRadius:10}}>
            <Text style={[{fontFamily:'reg',fontSize:16,color:color_scheme.primary}]}>{props.message}</Text>
        </View>
        </Animated.View>

    )
}

export function addMessage(message,message_st_func) {
    console.log("adding function")
    message_st_func(messages => [message])
}

export default Message;