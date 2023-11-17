import { useEffect, useState } from "react";
import { useAccessToken } from "../../../hooks/use-access-token";
import { useNav } from "../../../hooks/use-nav";
import { getUserEstimations } from "../../../helpers/api";
import { EndlessList } from "./endlessList";
import { StyleSheet, View } from "react-native";
import useInterval from "../../../hooks/use-interval";
import { useEstimations } from "../../../hooks/use-estimations";

export const AnimationsList: React.FC = () => {
    console.log("|| AnimationList")
    const { accessToken } = useAccessToken();
    const { getEstimations, setEstimations } = useEstimations();
    const { setEstimation } = useNav();
    const [initLoaded, setInitiLoaded] = useState<boolean>(false);

    const updateList = async () => {
        const result = await getUserEstimations(accessToken.accessToken);
        setEstimations(result);
    }

    const refreshTimer = 10000;
    useInterval(() => (updateList(), console.log(`Updated after ${refreshTimer}`)), 10000)

    useEffect(() => {
        updateList();
        if (!initLoaded) {
            setInitiLoaded(true);
        }
    }, [accessToken.accessToken])

    return (

        <View style={styles.container}>
            <>
                <EndlessList displaySpinner={!initLoaded} estimations={getEstimations() ?? []} loadData={() => updateList()} onPress={(e) => setEstimation(e)} />
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
