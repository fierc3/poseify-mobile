import * as React from 'react';
import { View, Text } from 'react-native';
import { useAuthSession } from './hooks/use-auth-session';
import Animations from './pages/animations';
import Login from './pages/login';
import { LogBox } from 'react-native';
import { useNav } from './hooks/use-nav';
import { Viewer } from './components/preview/viewer';
import { MD3LightTheme as DefaultTheme, PaperProvider, BottomNavigation } from 'react-native-paper';
import Recording from './pages/recording';


const animationsRoute = () => <Animations userName='User' />;
const recordRoute = () => <Recording />
const settingsRoute = () => <Text>settings</Text>



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any fallback UI
      return <Text>Something went wrong.</Text>;
    }

    return this.props.children;
  }
}


export default function App() {
  const { isLoggedIn } = useAuthSession();
  const { getEstimation, getCurrentPage, setCurrentPage } = useNav();

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

  let index = getCurrentPage();
  const isRecording = getCurrentPage() === 1;

  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        {
          isRecording &&
          <Recording />
        }

        {
          !isRecording &&
          <>
            {isLoggedIn ? <>
              {getEstimation() === null &&
                <BottomNavigation
                  navigationState={{ index, routes }} // is marked as deperecated but docs doesn't show another solution 🤷
                  onIndexChange={setCurrentPage}
                  renderScene={renderScene}
                />
              }
            </> : <>
              <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Login />
              </View>
            </>}
            <Viewer estimation={getEstimation()} />
          </>
        }
      </PaperProvider>
    </ErrorBoundary>
  );
}
