import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, Dimensions, ToastAndroid, Image, Button, TouchableHighlight } from "react-native";
import { AxiosHelper } from "../AxiosHelper";
import { BASE_URL, LOGIN } from "../ApiUrl";
import axios from "axios"

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
  width: ${(props: StyledComponents) => props.width-40}px;
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
          console.log(r.data.data);
        })
        .catch(e => {
          console.error("LOGIN:", e.response.data);
        })
    }

    return(
      <KeyboardAvoidingView>
        <LoginWrapper width={width} height={height}>
          <LoginContainer width={width}>
            <Image source={{uri: 'http://123.31.17.35:8033/static/media/HiMeDic-logo-1.23584bbb.png'}} style={{width: '100%', height: 100, resizeMode: "contain"}}/>
            <View style={{marginTop: 20}}>
              <CustomInput 
                defaultValue={username}
                onChangeText={(e:string) => setUsername(e)}
                placeholderTextColor={"#6e6e6e"} 
                placeholder={"Mã tra cứu"}
              />
            </View>
            <View style={{marginTop: 15}}>
              <CustomInput
                defaultValue={username}
                onChangeText={(e:string) => setPassword(e)}
                placeholderTextColor={"#6e6e6e"} 
                placeholder={"Mật khẩu"} 
                secureTextEntry
              />
            </View>
            <View style={{marginTop: 25}}>
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#ffffff"
                onPress={Login}
              >
                <View style={{
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#0474b4",
                  padding: 12
                }}>
                  <Text style={{fontSize: 16, color: 'white'}}>Đăng nhập</Text>
                </View>
              </TouchableHighlight>
            </View>
          </LoginContainer>
        </LoginWrapper>
      </KeyboardAvoidingView>
    );
};

export default LoginScreen;