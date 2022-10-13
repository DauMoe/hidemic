import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";
import { Dimensions, Image, View } from "react-native";
import { StyledComponents } from "../LoginScreen";
import { LoadToken } from "../SqlLiteHelper";
import { useNavigation } from "@react-navigation/native";
import { LOGIN_SCREEN, RESULT_SCREEN, TOKEN_TB_VALUE } from "../Constant";
import { TokenContext } from "../GlobalContext";

const LoadingWrapper = styled(View)`
  width: ${(props: StyledComponents) => props.width}px;
  height: ${(props: StyledComponents) => props.height}px;
  background-color: #ffffff;
  display         : flex;
  align-items     : center;
  justify-content : center;
  position        : relative;
`;

const LoadingScreen: React.FC = () => {
  const { width, height }         = Dimensions.get("window");
  const navigation                = useNavigation();
  const { authorized, setToken }  = useContext(TokenContext);
  
  useEffect(() => {
    setTimeout(() => {
      LoadToken()
        .then(r => {
          const { length, raw, item } = r.rows;
          if (length === 0) {
            navigation.navigate(LOGIN_SCREEN);
          } else {
            setToken(JSON.parse(item(0)[TOKEN_TB_VALUE]));
            navigation.navigate(RESULT_SCREEN);
          }
        })
        .catch(e => console.error("LOADING:", e.message));
    }, 1000);
  }, []);
  
  return(
    <LoadingWrapper width={width} height={height}>
      <View style={{
        height: 140,
        width: width-40,
        padding: 15,
        borderRadius: 10
      }}>
        <Image source={{uri: 'http://123.31.17.35:8033/static/media/HiMeDic-logo-1.23584bbb.png'}} style={{width: '100%', height: 100, resizeMode: "contain"}}/>
      </View>
    </LoadingWrapper>
  );
}

export default LoadingScreen;