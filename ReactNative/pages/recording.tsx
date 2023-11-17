import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useCameraDevice, useCameraPermission, CameraPosition } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { useNav } from '../hooks/use-nav';
import { IconButton, MD3Colors, Text } from 'react-native-paper';
import { VideoViewer } from '../components/video/videoViewer';
import { IconTextButton } from '../components/ui/buttons/iconTextButton';

export type Props = {};

const Recording: React.FC<Props> = ({
}) => {
    const { hasPermission, requestPermission } = useCameraPermission()
    const [permissionChecked, setPermissionChecked] = useState<boolean>(false);
    const { setCurrentPage } = useNav();
    const [cameraLoaded, setCameraLoaded] = useState(false);
    const [isCameraRecording, setIsCameraRecording] = useState(false);
    const camera = useRef<Camera>(null)
    const [videoPath, setVideoPath] = useState<string | null>(null);
    const [cameraType, setCameraType] = useState<CameraPosition>('back'); // 'front' or 'back'
    const device = useCameraDevice(cameraType)

    const [countdown, setCountdown] = useState(10); // Set initial countdown time
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: number = 0;

        if (isActive) {
            interval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1 / 10);
            }, 100);
        } else if (!isActive && countdown !== 0) {
            clearInterval(interval);
        }

        // When countdown reaches 0, stop the timer
        if (countdown === 0) {
            if (isActive) {
                camera.current?.stopRecording();
            }
            clearInterval(interval);
            setIsActive(false);

        }

        return () => clearInterval(interval);
    }, [isActive, countdown]);

    const startCountdown = () => {
        setCountdown(10); // Reset countdown time
        setIsActive(true);
    };

    const stopCountdown = () => {
        setIsActive(false);
    };

    setTimeout(() => setPermissionChecked(true), 1000) // we actually don't have a fixed time when we know that it has been checked


    // Function to toggle the camera
    const toggleCameraType = () => {
        setCameraType((currentType) => (currentType === 'back' ? 'front' : 'back'));
    };

    if (device == null) return <Text>Device has no camera that can record video</Text>

    return (
        <>
            {videoPath ? <VideoViewer path={videoPath} /> : (
                <View style={{ height: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {hasPermission ? <>
                        <Camera
                            ref={camera}
                            style={StyleSheet.absoluteFillObject}
                            device={device}
                            isActive={true}
                            onInitialized={() => setCameraLoaded(true)}
                            audio={false}
                            video={true}
                        />

                        {!cameraLoaded && (<Text style={{ color: "purple" }}>Loading...</Text>)}
                        {cameraLoaded && !isCameraRecording && (
                            <>
                                <IconButton
                                    icon="keyboard-backspace"
                                    iconColor={MD3Colors.error50}
                                    size={30}
                                    style={{ position: "absolute", top: 10, left: 10 }}
                                    onPress={() => setCurrentPage(0)} />
                                <IconButton
                                    icon="camera-flip"
                                    iconColor={MD3Colors.error50}
                                    size={30}
                                    style={{ position: "absolute", top: 10, right: 10 }}
                                    onPress={() => toggleCameraType()} />
                                <IconTextButton
                                    text='Start Recording'
                                    onPress={() => (setIsCameraRecording(true), camera.current?.startRecording({
                                        onRecordingFinished: (v) => (console.log(v), setVideoPath(v.path)),
                                        onRecordingError: (e) => console.warn(e)
                                    }), startCountdown())}
                                    containerStyle={{ alignItems: 'center', position: "absolute", bottom: 40, opacity: 0.7 }}
                                    icon="record-circle-outline" iconColor={"red"}
                                    variant='headlineSmall'
                                    iconSize={50} />
                            </>
                        )}
                        {isCameraRecording && (
                            <>
                                <View style={{ position: 'absolute', height: `${countdown * 10}%`, width: '8%', backgroundColor: '#6E47D5', left: 0, bottom: 0, opacity: 0.77 }}>
                                    <Text style={{ color: 'white', textAlign: 'center' }}>{Math.ceil(countdown)}</Text>
                                </View>
                                <IconTextButton
                                    text='Stop Recording'
                                    onPress={async () => (setCameraType('back'), setIsCameraRecording(false), await camera.current?.stopRecording(), stopCountdown())}
                                    containerStyle={{ alignItems: 'center', position: "absolute", bottom: 40, opacity: 0.3 }}
                                    icon="record-circle" iconColor={"red"}
                                    variant='headlineSmall'
                                    iconSize={50} />
                            </>
                        )}
                    </> : <View style={{display: permissionChecked ? 'flex' : 'none'}}>
                        <Text>To be able to record, camera access needs to be enabled</Text>
                        <Button title='Click to request permission' onPress={() => requestPermission()} />
                    </View>}
                </View>
            )}
        </>
    );
};


export default Recording;