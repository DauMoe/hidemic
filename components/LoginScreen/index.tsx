import React, { useState, useContext } from "react";
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, Dimensions, ToastAndroid, Image, Button, TouchableHighlight } from "react-native";
import { AxiosHelper } from "../AxiosHelper";
import { LOGIN } from "../ApiUrl";
import { useNavigation } from "@react-navigation/native";
import { RESULT_SCREEN } from "../Constant";
import { SaveToken } from "../SqlLiteHelper";
import { TokenContext } from "../GlobalContext";

export type StyledComponents = {
  width?: number,
  height?: number,
}

export type LoginProps = {
  
};

const LoginWrapper = styled(View)`
  width: ${(props: StyledComponents) => props.width}px;
  height: ${(props: StyledComponents) => props.height}px;
  background-color: #008274;
  display         : flex;
  align-items     : center;
  justify-content : center;
  position        : relative;
`;

const LoginContainer = styled(View)`
  padding: 30px;
  background-color: #e0e0e0b5;
  border-radius: 10px;
  width: ${(props: StyledComponents) => props.width ? (props.width-40) : (250-40)}px;
`;

const CustomInput = styled(TextInput)`
	height: 50px;
	background-color: white;
	border-radius: 10px;
	padding: 0 20px;
	color: black;
`;

const LoginScreen: React.FC = (props: LoginProps) => {
    const {width, height}           = Dimensions.get("window");
    const navigation                = useNavigation();
    const { setToken }              = useContext(TokenContext);
    const [username, setUsername]   = useState<string>(__DEV__ ? "4503" : "");
    const [password, setPassword]   = useState<string>(__DEV__ ? "111111" : "");

    const Login = async function() {
      if (username.trim() === "") {
        ToastAndroid.show("Enter your username or email", ToastAndroid.SHORT);
        return;
      }
      if (password.trim() === "") {
        ToastAndroid.show("Password is required", ToastAndroid.SHORT);
        return;
      }
      AxiosHelper(LOGIN, "post", {username, password})
        .then(r => {
          const responseData = r.data;
          // console.log(responseData);
          SaveToken(JSON.stringify(responseData.data))
            .then(r => {
              if (responseData.success) {
                setToken(responseData.data);
                navigation.navigate(RESULT_SCREEN);
              } else {
                ToastAndroid.show(responseData.message, ToastAndroid.LONG);
              }
            })
            .catch(e => {
              ToastAndroid.show("Saving token ERROR", ToastAndroid.LONG);
              __DEV__ ? console.error("SAVE TOKEN:", e.message) : undefined;
            })
        })
        .catch(e => {
          ToastAndroid.show(e.response.data, ToastAndroid.LONG);
          __DEV__ ? console.error("LOGIN:", e.response.data) : undefined;
        })
    }

    return(
      <KeyboardAvoidingView>
        <LoginWrapper width={width} height={height}>
          <LoginContainer width={width}>
            <Image source={require('./logo.png')} style={{width: '100%', height: 100, resizeMode: "contain"}}/>
            <View style={{marginTop: 20}}>
              <CustomInput 
                defaultValue={username}
                onChangeText={(e:string) => setUsername(e)}
                placeholderTextColor={"#6e6e6e"} 
                placeholder={"M?? tra c???u"}
              />
            </View>
            <View style={{marginTop: 15}}>
              <CustomInput
                defaultValue={password}
                onChangeText={(e:string) => setPassword(e)}
                placeholderTextColor={"#6e6e6e"} 
                placeholder={"M???t kh???u"} 
                secureTextEntry
              />
            </View>
            <View style={{marginTop: 25}}>
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#ffffff0"
                onPress={Login}
              >
                <View style={{
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#0474b4",
                  padding: 12
                }}>
                  <Text style={{fontSize: 16, color: 'white'}}>????ng nh???p</Text>
                </View>
              </TouchableHighlight>
            </View>
          </LoginContainer>
        </LoginWrapper>
      </KeyboardAvoidingView>
    );
};

export default React.memo(LoginScreen, (prevProps, nextProps) => {
  return true;
});