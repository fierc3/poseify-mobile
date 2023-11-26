import React, { } from 'react';
import { Appbar } from 'react-native-paper';
import { AnimationsList } from '../components/ui/list/animationsList';
import { TextSpinner } from '../components/ui/loading/textSpinner';
import { useEstimations } from '../hooks/use-estimations';
import * as WebBrowser from 'expo-web-browser';


const MemoizedAnimationsList = React.memo(() => {
    return (<AnimationsList />)
})

export const Animations: React.FC = () => {

    const { getEstimations } = useEstimations();

    return (
        <>
            <Appbar.Header style={{ display: 'flex', flexDirection: 'column' }}>
                <Appbar.Content title="Animations" style={{ justifyContent: 'center' }} />
                <Appbar.Action size={23} style={{position: 'absolute', right: 20, top: 5}} icon="help-circle-outline" onPress={() => WebBrowser.openBrowserAsync('https://github.com/fierc3/poseify/wiki/Poseify-Mobile-%E2%80%90-Quickstart#animations-list')} />
            </Appbar.Header>
            <MemoizedAnimationsList />
            {getEstimations() === null && (<TextSpinner label='Looking for your animations!' styleContainer={{ height: '100%', width: '100%', position: 'absolute' }} />)}
        </>
    );
};

export default Animations;