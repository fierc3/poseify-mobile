import * as React from 'react';
import { View } from 'react-native';
import { useAuthSession } from './hooks/use-auth-session';
import Animations from './pages/animations';
import Login from './pages/login';
import { LogBox } from 'react-native';
import { useNav } from './hooks/use-nav';
import { Viewer } from './components/preview/viewer';

export default function App() {
  const { isLoggedIn } = useAuthSession();
  const { getCurrentPage, getEstimation } = useNav();

  console.log("get", getEstimation())

  // Generally a lot of issues with ThreeJs and expo apparently (recent issues: https://github.com/pmndrs/react-three-fiber/discussions/2823)
  // Thus we ignore some logs
  LogBox.ignoreLogs(['Cannot read property \'getX\' of undefined', // this error happens always, not clean but we ignore it so that expo doesn't show a popup
    'Scripts "build/three.js" and "build/three.min.js" are deprecated with r150+' // can't fix this, issue is open
  ]);



  return (
    <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
      {isLoggedIn ? <>
        {getEstimation() === null &&
          <Animations userName='User' />
        }
      </> : <>
        <Login />
      </>}
      <Viewer estimation={getEstimation()} />
    </View>
  );
}
