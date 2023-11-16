import React, {  } from 'react';
import { Appbar } from 'react-native-paper';
import { AnimationsList } from '../components/ui/list/animationsList';


export const Animations: React.FC = () => {
    return (
        <>
            <Appbar.Header style={{ display: 'flex', flexDirection: 'column' }}>
                <Appbar.Content title="Animations" style={{ justifyContent: 'center' }} />
            </Appbar.Header>
            <AnimationsList />
        </>
    );
};

export default Animations;