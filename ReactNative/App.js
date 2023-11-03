import * as React from 'react';
import { View } from 'react-native';
import { useAuthSession } from './hooks/use-auth-session';
import Animations from './pages/animations';
import Login from './pages/login';

export default function App() {
  const {isLoggedIn} = useAuthSession();

  return (
    <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
      {isLoggedIn ? <>
        <Animations userName='User'/>
      </> : <>
      <Login/>
      </>}
    </View>
  );
}
