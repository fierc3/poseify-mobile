import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuthSession } from '../hooks/use-auth-session';
import { useAccessToken } from '../hooks/use-access-token';
import { CameraRuntimeError, PhotoFile, useCameraDevice, useCameraFormat, useFrameProcessor, VideoFile, useCameraPermission } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { useNav } from '../hooks/use-nav';
import { IconButton, MD3Colors } from 'react-native-paper';
import { VideoViewer } from '../components/video/videoViewer';
import { IconTextButton } from '../components/ui/buttons/iconTextButton';

export type Props = {};

const Recording: React.FC<Props> = ({
}) => {
    const { hasPermission, requestPermission } = useCameraPermission()
    const { setCurrentPage } = useNav();
    const device = useCameraDevice('back')
    const [cameraLoaded, setCameraLoaded] = useState(false);
    const [isCameraRecording, setIsCameraRecording] = useState(false);
    const camera = useRef<Camera>(null)
    const [videoPath, setVideoPath] = useState<string | null>(null);

    if (device == null) return <Text>Device has no camera that can record video</Text>

    return (
        <>
            {videoPath ? <VideoViewer path={videoPath} /> : (
                <View style={{ height: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {hasPermission ? <>
                        <Camera
                            ref={camera}
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={true}
                            onInitialized={() => setCameraLoaded(true)}
                            audio={false}
                            video={true}
                        />

                        {!cameraLoaded && (<Text style={{ color: "purple" }}>Loading...</Text>)}
                        <IconButton
                            icon="keyboard-backspace"
                            iconColor={MD3Colors.error50}
                            size={20}
                            style={{ position: "absolute", top: 10, left: 10 }}
                            onPress={() => setCurrentPage(0)} />

                        {cameraLoaded && !isCameraRecording && (
                            <IconTextButton
                                text='Start Recording'
                                onPress={() => (setIsCameraRecording(true), camera.current?.startRecording({
                                    onRecordingFinished: (v) => (console.log(v), setVideoPath(v.path)),
                                    onRecordingError: (e) => console.warn(e)
                                }))}
                                containerStyle={{ alignItems: 'center', position: "absolute", bottom: 40 }}
                                icon="record-circle" iconColor={"red"}
                                iconSize={40} />
                        )}
                        {isCameraRecording && (
                            <IconTextButton
                                text='Stop Recording'
                                onPress={() => (setIsCameraRecording(false), camera.current?.stopRecording())}
                                containerStyle={{ alignItems: 'center', position: "absolute", bottom: 40 }}
                                icon="record-circle-outline" iconColor={"red"}
                                iconSize={40} />
                        )}
                    </> : <>
                        <Text>To be able to record, camera access needs to be enabled</Text>
                        <Button title='Click to request permission' onPress={() => requestPermission()} />
                    </>}
                </View>
            )}
        </>
    );
};


export default Recording;