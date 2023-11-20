import { memo, useEffect, useState } from "react";
import { useAccessToken } from "../../../hooks/use-access-token";
import { useNav } from "../../../hooks/use-nav";
import { deleteAnimation, getUserEstimations } from "../../../helpers/api";
import { EndlessList } from "./endlessList";
import { StyleSheet, View } from "react-native";
import useInterval from "../../../hooks/use-interval";
import { useEstimations } from "../../../hooks/use-estimations";
import { Snackbar } from "react-native-paper";
import { EstimationState, IEstimation } from "../../../helpers/api.types";
import { useArrayEquals } from "../../../hooks/use-array-equals";
import { ConfirmApiDialog } from "../confirm/confirmApiDialog";

export const AnimationsList: React.FC = () => {
    console.log("|| AnimationList")
    const { accessToken } = useAccessToken();
    const { getEstimations, setEstimations } = useEstimations();
    const { setEstimation, getEstimation } = useNav();
    const [initLoaded, setInitiLoaded] = useState<boolean>(false);
    const { arraysAreEqual } = useArrayEquals();
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

    const [info, setInfo] = useState<{ estimationId: string, message: string, estimationState: EstimationState } | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

    const updateList = async () => {
        const result = await getUserEstimations(accessToken.accessToken);

        if (!arraysAreEqual(result, getEstimations() ?? [])) {
            setEstimations(result);
        }
    }

    const refreshTimer = 30000;
    useInterval(() => {

        if (getEstimation() !== null) {
            // If youre focused on an estimation, we don't want to update the animation list.
            // We want to avoid rerenders while in the animation viewer.
            return;
        }

        updateList()
        console.log(`Updated after ${refreshTimer}`)
    }, refreshTimer)

    useEffect(() => {
        console.log('Reloading due to access token or nav')

        updateList();
        if (!initLoaded) {
            setInitiLoaded(true);
        }
    }, [accessToken.accessToken])

    const buildInfoMessage = (estimation: IEstimation) => {
        if (estimation.state === EstimationState.Processing) {
            return 'Is being processed. ⚙️\n' + estimation.stateText;
        } else if (estimation.state === EstimationState.Queued) {
            return 'Is currently in the Queue.  🕥\n' + estimation.stateText;
        } else if (estimation.state === EstimationState.Failed) {
            return 'Sadly failed... 😔\n' + estimation.stateText;
        }
        return '...';
    }

    return (

        <View style={styles.container}>
            <>
                <EndlessList displaySpinner={!initLoaded} estimations={getEstimations() ?? []} loadData={() => updateList()} open={(e) => setEstimation(e)} info={(e) => (setInfo({ estimationId: e.internalGuid, message: buildInfoMessage(e), estimationState: e.state }), setSnackbarVisible(true))} />
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    action={info?.estimationState === EstimationState.Failed ? {
                        label: 'delete',
                        onPress: () => {
                            console.log("infomessage", info)
                            setDeleteVisible(true);
                        }
                    } : {
                        label: 'hide',
                        // do nothign will just hide it 
                    }}>
                    {info?.message}
                </Snackbar>
                {deleteVisible && (
                    <ConfirmApiDialog
                        apiCall={deleteAnimation}
                        apiProps={[accessToken.accessToken, info?.estimationId]}
                        visible={deleteVisible}
                        hideDialog={() => (updateList(), setDeleteVisible(false))}
                        startButtonText='Remove'
                        text='Remove this failed animation?'
                        apiDoneText='Animation is deleted!'
                        apiLoadingText='Removing your animation...'
                    />
                )}
            </>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
