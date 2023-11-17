import React, { } from 'react';
import { Appbar } from 'react-native-paper';
import { AnimationsList } from '../components/ui/list/animationsList';
import { TextSpinner } from '../components/ui/loading/textSpinner';
import { useEstimations } from '../hooks/use-estimations';


const MemoizedAnimationsList = React.memo(() => {
    return (<AnimationsList />)
})

export const Animations: React.FC = () => {

    const { getEstimations } = useEstimations();

    return (
        <>
            <Appbar.Header style={{ display: 'flex', flexDirection: 'column' }}>
                <Appbar.Content title="Animations" style={{ justifyContent: 'center' }} />
            </Appbar.Header>
            <MemoizedAnimationsList />
            {getEstimations() === null && (<TextSpinner label='Looking for your animations!' styleContainer={{ height: '100%', width: '100%', position: 'absolute' }} />)}
        </>
    );
};

export default Animations;