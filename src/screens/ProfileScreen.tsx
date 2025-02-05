import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet
} from 'react-native';
import { StreamLayer } from 'react-native-streamlayer';

function ProfileScreen(): React.JSX.Element {

  const [isInitialized, setInitialized] = useState(false);
  const [isUserAuthorized, setUserAuthorized] = useState(false);
  const [schema, setSchema] = useState<String>("");
  const [token, setToken] = useState<String>("");

  const checkState = async () => {
    try {
      const result = await StreamLayer.isInitialized();
      setInitialized(result)
    } catch (e) {
      console.error(e);
    }
  };

  const checkAuthorized = async () => {
    try {
      const result = await StreamLayer.isUserAuthorized();
      setUserAuthorized(result)
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await StreamLayer.logout();
      checkAuthorized()
    } catch (e) {
      console.error(e);
    }
  };

  const useAnonymousAuth = async () => {
    try {
      await StreamLayer.useAnonymousAuth();
      checkAuthorized()
    } catch (e) {
      console.error(e);
    }
  };

  const bypassAuth = async () => {
    try {
      await StreamLayer.authorizationBypass(schema, token);
      checkAuthorized()
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("ProfileScreen is focused")
      {
        checkState()
        checkAuthorized()
      }
      return () => {
        console.log("ProfileScreen is blurred")
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
      <Text style={styles.text}>StreamLayer is initialized={isInitialized.toString()}</Text>
      <Text style={styles.text}>------- User state -------</Text>
      <Text style={styles.text}>User is authorized={isUserAuthorized.toString()}</Text>
      <Button title="Logout" onPress={logout} />
      <Text style={styles.text}>------- Bypass Auth -------</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter schema"
        placeholderTextColor='black'
        onChangeText={newText => setSchema(newText)}
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor='black'
        placeholder="Enter token"
        onChangeText={newText => setToken(newText)}
      />
      <Button title="Bypass Auth" onPress={bypassAuth} />
      <Text style={styles.text}>------- Anonymous Auth -------</Text>
      <Button title="Anonymous Auth" onPress={useAnonymousAuth} />
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    marginTop: 8,
    fontSize: 20
  },
  textInput: {
    height: 44,
    width: 240,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    color: 'black',
    fontSize: 16
  }
});

export default ProfileScreen;