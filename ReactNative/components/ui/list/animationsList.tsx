import { useEffect, useState } from "react";
import { useAccessToken } from "../../../hooks/use-access-token";
import { useNav } from "../../../hooks/use-nav";
import { IEstimation } from "../../../helpers/api.types";
import { getUserEstimations } from "../../../helpers/api";
import { EndlessList } from "./endlessList";
import { StyleSheet, View } from "react-native";
import useInterval from "../../../hooks/use-interval";

export const AnimationsList: React.FC = () => {
    console.log("|| AnimationList")
    const { accessToken } = useAccessToken();
    const { setEstimation } = useNav();
    const [estimations, setEstimations] = useState<IEstimation[]>([]);
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
                <EndlessList displaySpinner={!initLoaded} estimations={estimations} loadData={() => updateList} onPress={(e) => setEstimation(e)} />
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
