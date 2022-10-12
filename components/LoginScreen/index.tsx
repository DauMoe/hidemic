import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, Dimensions, ToastAndroid } from "react-native";

export type LoginScreenProps = {

}

const LoginScreenWrapper = styled(View)`
    height          : ${props => props.height + "px"};
    display         : flex;
    align-items     : center;
    justify-content : center;
    background-color: #2A719D;
    position        : relative;
`;

const LoginBgImage = styled(View)`
    position: absolute; 
`;

const LoginFormWrapper = styled(View)`
    padding         : 20px 30px 15px 30px;
    width           : ${props => (props.width - 26) + "px"};
    background-color: white;
    border-radius   : 30px;
`;

const LoginHeaderWrapper = styled(View)`
    margin-bottom: 25px;
`;

const LoginHeader = styled(Text)`
    color       : #329FD9;
    font-size   : 48px;
    font-family : "NunitoBlack";
    text-align: center;
`;

const LoginDescription = styled(Text)`
    color: #4ACAF9;
    text-align: center;
    font-family: "NunitoMedium";
`;

const LoginTextInput = styled(TextInput)`
    background-color: white;
    color           : #3F3F3F;
    position        : relative;
    font-family     : "NunitoBold";
    padding         : 4px 10px;
    font-size: 18px;
    border: none;
    border-bottom-width: 1.5px;
    border-bottom-color: #8C8B8B;
    border-radius   : 10px;
`;

const LoginLabel = styled(Text)`
    font-size       : 18px;
    margin-bottom   : 5px;
    color           : black;
    font-family     : "NunitoSemiBold";
`;

const ForgetPassword = styled(Text)`
    font-family     : "NunitoMediumItalic";
    color           : #37B4F3;
    text-decoration : underline;
    text-align      : right;
`;

const CreateNewAccount = styled(Text)`
    font-family     : "NunitoSemiBold";
    color           : #37B4F3;
    text-align      : center;
    font-size       : 15px;
`;

export type LoginProps = {
  
};

const LoginScreen: React.FC = (props: LoginProps) => {
    const {width, height}           = Dimensions.get("window");
    const [username, setUsername]   = useState(__DEV__ ? "daumoe" : "");
    const [password, setPassword]   = useState(__DEV__ ? "123" : "");
    const [showPass, setPlainPass]  = useState(false);

    const Authenticate = function() {
      if (username.trim() === "") {
        ToastAndroid.show("Enter your username or email", ToastAndroid.SHORT);
        return;
      }
      if (password.trim() === "") {
        ToastAndroid.show("Password is required", ToastAndroid.SHORT);
        return;
      }
    }

    useEffect(function() {
      
    });

    return(
      <></>
    );
};

export default LoginScreen;