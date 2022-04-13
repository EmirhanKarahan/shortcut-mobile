import React, { useReducer, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native";
import {
  AuthContext,
  authReducer,
  initialAuthState,
} from "./context/AuthContext";

import CreateAppointmentScreen from "./screens/CreateAppointmentScreen";
import UserAppointmentsScreen from "./screens/UserAppointmentsScreen";
import HairdresserAppointmentsScreen from "./screens/HairdresserAppointmentsScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";

const Stack = createNativeStackNavigator();

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? "dodgerblue" : "",
  },
  headerTintColor: Platform.OS === "android" ? "white" : "dodgerblue",
};

function App() {
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const contextValue = useMemo(() => {
    return { authState, authDispatch };
  }, [authState, authDispatch]);


  return (
    <AuthContext.Provider value={contextValue}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={defaultNavOptions}>
          {contextValue.authState.isLoggedIn ? (
            <>
              <Stack.Screen
                name="Your Appointments"
                component={UserAppointmentsScreen}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Button
                      onPress={() =>
                        navigation.navigate("Create An Appointment")
                      }
                      title="+"
                    />
                  ),
                  headerLeft: () => {
                      return (
                        <Button
                          onPress={() =>
                            navigation.navigate("Hairdresser Appointments")
                          }
                          title="All"
                        />
                      );
                  },
                })}
              />
              <Stack.Screen
                name="Create An Appointment"
                component={CreateAppointmentScreen}
              />
              <Stack.Screen
                name="Hairdresser Appointments"
                component={HairdresserAppointmentsScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Sign In" component={SignInScreen} />
              <Stack.Screen name="Sign Up" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
