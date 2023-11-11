import * as React from 'react';
import { View, Text } from 'react-native';
import { useAuthSession } from './hooks/use-auth-session';
import Animations from './pages/animations';
import Login from './pages/login';
import { LogBox } from 'react-native';
import { useNav } from './hooks/use-nav';
import { Viewer } from './components/preview/viewer';
import { MD3LightTheme as DefaultTheme, PaperProvider, BottomNavigation } from 'react-native-paper';


const animationsRoute = () => <Animations userName='User' />;
const recordRoute = () => <Text>Ohhh</Text>
const settingsRoute = () => <Text>settings</Text>

export default function App() {
  const { isLoggedIn } = useAuthSession();
  const { getEstimation } = useNav();

  // Generally a lot of issues with ThreeJs and expo apparently (recent issues: https://github.com/pmndrs/react-three-fiber/discussions/2823)
  // Thus we ignore some logs
  LogBox.ignoreLogs(['Cannot read property \'getX\' of undefined', // this error happens always, not clean but we ignore it so that expo doesn't show a popup
    'Scripts "build/three.js" and "build/three.min.js" are deprecated with r150+' // can't fix this, issue is open
  ]);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
    },
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'animation', title: 'Animations', focusedIcon: 'animation-play', unfocusedIcon: 'animation-play-outline' },
    { key: 'record', title: 'Record', focusedIcon: 'record-circle-outline' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    animation: animationsRoute,
    record: recordRoute,
    settings: settingsRoute,
  });

  return (
    <PaperProvider theme={theme}>
      {isLoggedIn ? <>
        {getEstimation() === null &&
          <BottomNavigation
            navigationState={{ index, routes }} // is marked as deperecated but docs doesn't show another solution 🤷
            onIndexChange={setIndex}
            renderScene={renderScene}
          />
        }
      </> : <>
        <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Login />
        </View>
      </>}
        <Viewer estimation={getEstimation()} />

    </PaperProvider>
  );
}
