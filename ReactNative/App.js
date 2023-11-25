import * as React from 'react';
import { View } from 'react-native';
import { useAuthSession } from './hooks/use-auth-session';
import Animations from './pages/animations';
import Settings from './pages/settings';
import Login from './pages/login';
import { LogBox } from 'react-native';
import { useNav } from './hooks/use-nav';
import { Viewer } from './components/preview/viewer';
import { MD3LightTheme as DefaultTheme, PaperProvider, BottomNavigation } from 'react-native-paper';
import Recording from './pages/recording';
import { useEstimations } from './hooks/use-estimations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

// avoids the viewer to be rerendered, only when the selected estimation has changed
const MemoizedSettings = React.memo(() => {
  return (<Settings />)
})

const animationsRoute = () => <Animations userName='User' />;
const recordRoute = () => <Recording />
const settingsRoute = () => <MemoizedSettings />

// avoids the viewer to be rerendered, only when the selected estimation has changed
const MemoizedViewer = React.memo(({ estimation }) => {
  return (<Viewer estimation={estimation} />)
})


export default function App() {
  const { isLoggedIn } = useAuthSession();
  const { getEstimations } = useEstimations();
  const { getEstimation, getCurrentPage, setCurrentPage } = useNav();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
    },
  };

  const routesDefault = () => [
    { key: 'animation', title: 'Animations', focusedIcon: 'animation-play', unfocusedIcon: 'animation-play-outline', badge: (getEstimations() ?? []).length },
    { key: 'record', title: 'Record', focusedIcon: 'record-circle-outline' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog' }
  ]

  const [routes, setRoutes] = React.useState(routesDefault());

  React.useEffect(() => { setRoutes(routesDefault()) }, [getEstimations()])


  const renderScene = BottomNavigation.SceneMap({
    animation: animationsRoute,
    record: recordRoute,
    settings: settingsRoute,
  });

  let index = getCurrentPage();
  const isRecording = getCurrentPage() === 1;
  StatusBar.setBarStyle('dark-content', true);

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          {
            isRecording &&
            <Recording />
          }
          {
            !isRecording &&
            <>
              {isLoggedIn ? <>

                <BottomNavigation
                  style={{ display: getEstimation() === null ? 'flex' : 'none' }}
                  navigationState={{ index, routes }} // is marked as deperecated but docs doesn't show another solution 🤷
                  onIndexChange={setCurrentPage}
                  renderScene={renderScene}
                />

              </> : <>
                <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <Login />
                </View>
              </>}
              <MemoizedViewer estimation={getEstimation()} />
            </>
          }
        </PaperProvider>
    </SafeAreaView>
  );
}
