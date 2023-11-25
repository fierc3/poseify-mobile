import { LogBox } from "react-native";

export const useLogSuppression = () => {
    // Generally a lot of issues with ThreeJs and expo apparently (recent issues: https://github.com/pmndrs/react-three-fiber/discussions/2823)
    // Thus we ignore some logs
    LogBox.ignoreLogs(['Cannot read property \'getX\' of undefined', // this error happens always, not clean but we ignore it so that expo doesn't show a popup
        'Scripts "build/three.js" and "build/three.min.js" are deprecated with r150+' // can't fix this, issue is open
    ]);
}