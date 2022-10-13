import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CHANGE_PASSWORD_SCREEN, DETAIL_SCREEN, LOADING_SCREEN, LOGIN_SCREEN, RESULT_SCREEN } from './components/Constant';
import LoadingScreen from "./components/LoadingScreen";
import { AuthorizationObj, TokenContext } from "./components/GlobalContext";
import ResultScreen from "./components/ResultScreen";
import { useEffect } from "react";
import DetailScreen from "./components/ResultScreen/DetailScreen";
import ChangePasswordScreen from "./components/ChangePasswordScreen";

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [authorized, setToken] = useState({});
  const value = { authorized, setToken };

  return(
    <TokenContext.Provider value={value}>
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={LOADING_SCREEN}
        >
          <Stack.Screen
            name={LOADING_SCREEN}
            component={LoadingScreen}
            options={{
              animation: "none"
            }}
          />
          <Stack.Screen
            name={LOGIN_SCREEN}
            component={LoginScreen}
            options={{
              animation: "none"
            }}
          />
          <Stack.Screen
            name={RESULT_SCREEN}
            component={ResultScreen}
            options={{
              animation: "none"
            }}
          />
          <Stack.Screen
            name={DETAIL_SCREEN}
            component={DetailScreen}
            options={{
              animation: "none"
            }}
          />
          <Stack.Screen
            name={CHANGE_PASSWORD_SCREEN}
            component={ChangePasswordScreen}
            options={{
              animation: "none"
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TokenContext.Provider>
  )
}

export default App;