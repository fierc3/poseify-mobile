import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Model } from './model';
import { AttachmentType, IEstimation } from '../../helpers/api.types';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getBvh } from '../../helpers/api';
import { useAccessToken } from '../../hooks/use-access-token';
import { useNav } from '../../hooks/use-nav';
import { ShareFileButton } from '../ui/buttons/shareFileButton';
import { Appbar, Chip } from 'react-native-paper';
import { TextSpinner } from '../ui/loading/textSpinner';


export type Props = {
    estimation: IEstimation;
};

export const Viewer: React.FC<Props> = ({ estimation }) => {
    console.log("|| Viewer")

    const [bvhData, setBvhData] = useState<string | null>(null);
    const { accessToken } = useAccessToken();
    const { setEstimation } = useNav();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const camera = new THREE.PerspectiveCamera(80)
    camera.position.set(1, 2, 4)

    let angle = 0;
    const radius = camera.position.length(); // assuming the camera is already some distance away from the center
    const interval = setInterval(() => {
        angle += 0.02; // adjust this value to change the rotation speed

        camera.position.x = radius * Math.cos(angle);
        camera.position.z = radius * Math.sin(angle);

        camera.lookAt(0, 0, 0); // assuming you want to look at the origin
    }, 30);

    useEffect(() => {
        if (estimation === null) return;
        clearInterval(interval);
        const fetchData = async () => setBvhData(await getBvh(estimation, accessToken.accessToken));
        fetchData();
    }, [estimation])


    return (
        <>
            {estimation && (<>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => (setEstimation(null), setBvhData(null), setIsLoaded(false))} />
                    <Appbar.Content title={estimation.displayName} />
                </Appbar.Header>
                {!isLoaded && (<TextSpinner label='Loading Your Animation! 🎬' />)}</>
            )}

            <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: estimation === null || bvhData === null ? 'none' : 'flex' }}>
                <Canvas
                    camera={camera}
                    gl={{ antialias: true }}
                    onCreated={(state) => {
                        console.log("created");
                        state.scene.background = new THREE.Color("#f0f0f0");
                        state.scene.add(new THREE.GridHelper(5, 10));
                        const _gl = state.gl.getContext();
                        const pixelStorei = (_gl as any).pixelStorei.bind(_gl);

                        (_gl as any).pixelStorei = function (...args: [any]) {
                            const [parameter] = args;
                            switch (parameter) { case (_gl as any).UNPACK_FLIP_Y_WEBGL: return pixelStorei(...args) }
                        }

                        setIsLoaded(true);
                    }
                    }
                    style={{ width: "100%", maxHeight: "50%", height: "50%", display: estimation === null || bvhData === null ? 'none' : 'flex' }}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <Model bvhData={bvhData} />
                </Canvas>
                {estimation && isLoaded && (
                    <View style={{ flexGrow: 0.5, justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                        <View style={{ justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                            {estimation.tags.map(tag => <Chip icon="tag">{tag}</Chip>)}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                            <ShareFileButton attachmentType={AttachmentType.Bvh} estimation={estimation} text='Share BVH' />
                            <ShareFileButton attachmentType={AttachmentType.Fbx} estimation={estimation} text='Share FBX' />
                        </View>

                    </View>
                )}
            </View>
        </>
    )
}

