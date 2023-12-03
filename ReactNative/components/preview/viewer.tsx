import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Model } from './model';
import { AttachmentType, IEstimation } from '../../helpers/api.types';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { deleteAnimation, getBvh } from '../../helpers/api';
import { useAccessToken } from '../../hooks/use-access-token';
import { useNav } from '../../hooks/use-nav';
import { ShareFileButton } from '../ui/buttons/shareFileButton';
import { Appbar, Button, Chip, Text } from 'react-native-paper';
import { TextSpinner } from '../ui/loading/textSpinner';
import { getIconName } from '../../helpers/tags';
import { ConfirmApiDialog } from '../ui/confirm/confirmApiDialog';
import React from 'react';
import useInterval from '../../hooks/use-interval';


const MemoizedConfirmDialog = React.memo(ConfirmApiDialog);


export type Props = {
    estimation: IEstimation;
};

export const Viewer: React.FC<Props> = ({ estimation }) => {
    console.log("|| Viewer")

    const [bvhData, setBvhData] = useState<string | null>(null);
    const { accessToken } = useAccessToken();
    const { setEstimation } = useNav();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
    const [customRotation, setCustomRotation] = useState<boolean>(false);

    const camera = new THREE.PerspectiveCamera(80)
    camera.position.set(1, 2, 4)

    let lastX = 0;
    let lastY = 0;

    let yawAngle = 0;
    let pitchAngle = 0;
    let radius = 5; // Distance of the camera from the center

    useInterval(() => {
        if (customRotation) return;

        yawAngle += 0.02;

        camera.position.x = radius * Math.cos(yawAngle);
        camera.position.z = radius * Math.sin(yawAngle);

        camera.lookAt(0, 1, 0); // Look at the center and ca. human height
    }, 30)


    const onMove = (event: React.TouchEvent<HTMLDivElement>) => {
        const { pageX, pageY, touches } = event.nativeEvent as { pageX: number, pageY: number, touches: [] };

        if (lastX === 0) {
            lastX = pageX
        }

        if (lastY === 0) {
            lastY = pageY
        }

        if (!event.nativeEvent || touches.length > 1 || touches.length === 0) return;

        setCustomRotation(true);

        let deltaX = 0;
        let deltaY = 0;

        deltaX = pageX - lastX;
        deltaY = pageY - lastY;

        lastX = pageX;
        lastY = pageY;

        yawAngle += deltaX * 0.01;
        pitchAngle = Math.max(Math.min(pitchAngle + deltaY * 0.01, Math.PI / 2), -Math.PI / 2);

        updateCameraPosition();
    };

    const updateCameraPosition = () => {
        camera.position.x = radius * Math.sin(yawAngle) * Math.cos(pitchAngle);
        camera.position.y = radius * Math.sin(pitchAngle);
        camera.position.z = radius * Math.cos(yawAngle) * Math.cos(pitchAngle);
        camera.lookAt(new THREE.Vector3(0, 1, 0)); // Look at the center and ca. human height
    };

    useEffect(() => {
        if (estimation === null) return;
        setCustomRotation(false);
        const fetchData = async () => setBvhData(await getBvh(estimation, accessToken.accessToken));
        fetchData();
    }, [estimation])

    const zoom = (zoomChange: number) => {
        radius += zoomChange

        if (customRotation) {
            updateCameraPosition();
        }
    }

    const [fadeAnim] = useState(new Animated.Value(0));

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Target opacity value
            duration: 1000, // Duration of the animation in milliseconds
            useNativeDriver: true, // Add this to use native driver for better performance
        }).start();
    };

    const fadeOut = (onFadeOut: () => any) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(onFadeOut);
    };


    return (
        <>
            {estimation && (<>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => fadeOut(() => { setEstimation(null); setBvhData(null); setIsLoaded(false); })} />
                    <Appbar.Content title={estimation.displayName} />
                    <Appbar.Action icon={'delete'} onPress={() => setDeleteVisible(true)} />
                </Appbar.Header>
                {!isLoaded && (<TextSpinner label='Loading Your Animation! 🎬' />)}
                <MemoizedConfirmDialog
                    apiCall={deleteAnimation}
                    apiProps={[accessToken.accessToken, estimation.internalGuid]}
                    visible={deleteVisible}
                    hideDialog={() => setDeleteVisible(false)}
                    startButtonText='Delete'
                    text='Delete this animation?'
                    apiDoneText='Animation is deleted!'
                    apiLoadingText='Deleting your animation...'
                />
            </>
            )}

            <Animated.View style={{
                flex: 1,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                display: estimation === null || bvhData === null ? 'none' : 'flex',
                opacity: fadeAnim // Bind opacity to animated value 
            }}>
                <Canvas
                    onTouchMove={onMove}
                    onTouchStart={e => {
                        const nativeEvent = e.nativeEvent as { pageX: number, pageY: number }
                        lastX = nativeEvent.pageX;
                        lastY = nativeEvent.pageY;
                    }}
                    camera={camera}
                    gl={{ antialias: true }}
                    onCreated={(state) => {
                        state.scene.background = new THREE.Color("#f0f0f0");
                        state.scene.add(new THREE.GridHelper(5, 10));
                        const _gl = state.gl.getContext();
                        const pixelStorei = (_gl as any).pixelStorei.bind(_gl);

                        (_gl as any).pixelStorei = function (...args: [any]) {
                            const [parameter] = args;
                            switch (parameter) { case (_gl as any).UNPACK_FLIP_Y_WEBGL: return pixelStorei(...args) }
                        }

                        setIsLoaded(true);
                        fadeIn();
                    }
                    }
                    style={{ width: "100%", maxHeight: "50%", height: "50%", display: estimation === null || bvhData === null ? 'none' : 'flex', zIndex: -10 }}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <Model bvhData={bvhData} />
                </Canvas>
                <Button style={{ position: 'absolute', right: 0, top: '38%' }} labelStyle={{ fontSize: 20 }} onPress={() => zoom(-0.4)}>+</Button>
                <Button style={{ position: 'absolute', right: 0, top: '43%' }} labelStyle={{ fontSize: 20 }} onPress={() => zoom(+0.4)}>-</Button>
                {!customRotation && (<Text style={{ position: 'absolute', top: '4%', opacity: 0.3 }} variant='titleMedium'>- Swipe to Rotate -</Text>)}
                {estimation && isLoaded && (
                    <View style={{ flexGrow: 0.5, justifyContent: 'space-evenly', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', gap: 4, flexWrap: 'wrap', zIndex: -1 }}>
                            {   // workaround for tags bug
                                (estimation?.tags[0] ?? '').split(",").filter(tag => tag.length > 0).map((tag, i) => 
                                <Chip key={i} icon={getIconName(tag)}>{tag}</Chip>)
                            }
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                            <ShareFileButton attachmentType={AttachmentType.Bvh} estimation={estimation} text='BVH' />
                            <ShareFileButton attachmentType={AttachmentType.TBvh} estimation={estimation} text='BVH+T-Pose' />
                            <ShareFileButton attachmentType={AttachmentType.Fbx} estimation={estimation} text='FBX' />
                            <ShareFileButton attachmentType={AttachmentType.TFbx} estimation={estimation} text='FBX+T-Pose' />
                        </View>

                    </View>
                )}
            </Animated.View >
        </>
    )
}

