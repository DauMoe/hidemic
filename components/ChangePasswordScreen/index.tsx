import { useNavigation, useRoute } from "@react-navigation/native";
import { Dimensions, View, TouchableHighlight, Text, TouchableOpacity, ToastAndroid, TextInput } from 'react-native';
import { useContext } from 'react';
import { TokenContext } from "../GlobalContext";
import { StyledComponents } from "../LoginScreen";
import styled from 'styled-components/native';
import { useState } from 'react';
import { AxiosHelper } from "../AxiosHelper";
import { CHANGE_PASSWORD } from "../ApiUrl";
import { DETAIL_SCREEN } from "../Constant";
import Icon from 'react-native-vector-icons/FontAwesome';

const ChangepasswordWrapper = styled(View)`
  width: ${(props: StyledComponents) => props.width}px;
  height: ${(props: StyledComponents) => props.height}px;
  background-color: #008274;
  display         : flex;
  align-items     : center;
  justify-content : center;
  position        : relative;
`;

const ChangepasswordContainer = styled(View)`
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

const ChangepasswordHeader = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: 600;
  color: #008b8b;
`;

const ChangePasswordScreen = () => {
  const { width, height }         = Dimensions.get("window");
  const navigation                = useNavigation();
  const route                     = useRoute();
  const { authorized, setToken }  = useContext(TokenContext);
  const [password, setPassword]   = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: ""
  });

  const ChangePassword = () => {
    if (password.currentPassword.trim() === "" || password.newPassword.trim() === "" || password.repeatNewPassword.trim() === "") {
      ToastAndroid.show("Điền đầy đủ các trường", ToastAndroid.LONG);
      return;
    }
    if (password.currentPassword.trim().length<6 || password.newPassword.trim().length<6 || password.repeatNewPassword.trim().length<6) {
      ToastAndroid.show("Độ dài tối thiểu 6 ký tự", ToastAndroid.LONG);
      return;
    }
    if (password.newPassword.trim() !== password.repeatNewPassword.trim()) {
      ToastAndroid.show("Mật khẩu mới không trùng nhau", ToastAndroid.LONG);
      return;
    }
    console.log(password);
    AxiosHelper(CHANGE_PASSWORD, 'post', {
      newPassword: password.newPassword,
      oldPassword: password.currentPassword
    }, {
      headers: {
        'Authorization': `Bearer ${authorized.token}`
      }
    })
      .then(r => {
        if (r.data.success) {
          ToastAndroid.show("Cập nhật thành công", ToastAndroid.LONG);
          navigation.canGoBack() ? navigation.goBack() : navigation.navigate(DETAIL_SCREEN);
        } else {
          ToastAndroid.show(r.data.message, ToastAndroid.LONG);
        }
      })
      .catch(e => {
        console.error("CHANGE PASS", e.response.data);
        ToastAndroid.show(e.response.message, ToastAndroid.LONG);
      })
  }

  return(
    <ChangepasswordWrapper width={width} height={height}>
      <ChangepasswordContainer width={width}>
        <ChangepasswordHeader>Đổi mật khẩu</ChangepasswordHeader>
        <View style={{position: "absolute", top: 35, left: 40, zIndex: 9999}}>
          <TouchableOpacity onPress={_ => {navigation.canGoBack() ? navigation.goBack() : navigation.navigate(DETAIL_SCREEN)}}>
            <Icon name="caret-left" size={30} color="#ffffff"/>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          <CustomInput 
            secureTextEntry
            defaultValue={password.currentPassword}
            onChangeText={(e:string) => setPassword({...password, currentPassword: e})}
            placeholderTextColor={"#6e6e6e"} 
            placeholder={"Mật khẩu hiện tại"}
          />
        </View>
        <View style={{marginTop: 15}}>
          <CustomInput 
            secureTextEntry
            defaultValue={password.newPassword}
            onChangeText={(e:string) => setPassword({...password, newPassword: e})}
            placeholderTextColor={"#6e6e6e"} 
            placeholder={"Mật khẩu mới"}
          />
        </View>
        <View style={{marginTop: 15}}>
          <CustomInput 
            secureTextEntry
            defaultValue={password.repeatNewPassword}
            onChangeText={(e:string) => setPassword({...password, repeatNewPassword: e})}
            placeholderTextColor={"#6e6e6e"} 
            placeholder={"Nhập lại mật khẩu mới"}
          />
        </View>
        <View style={{marginTop: 25}}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#ffffff"
            onPress={ChangePassword}
          >
            <View style={{
              borderRadius: 10,
              alignItems: "center",
              backgroundColor: "#0474b4",
              padding: 12
            }}>
              <Text style={{fontSize: 16, color: 'white'}}>Xác nhận</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ChangepasswordContainer>
    </ChangepasswordWrapper>
  )
}

export default ChangePasswordScreen;