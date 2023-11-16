import { FlatList } from "react-native";
import { EstimationState, IEstimation } from "../../../helpers/api.types";
import { Divider, List, Text } from "react-native-paper";
import { TextSpinner } from "../loading/textSpinner";

type EndlessListProps = {
    estimations: IEstimation[],
    loadData: () => any,
    onPress?: (estimation: IEstimation) => void | undefined,
    displaySpinner: boolean
}

const errorEntry = () => {
    return <List.Icon icon="exclamation" color="#DF6E49" />
}

const confirmEntry = () => {
    return <List.Icon icon="check" color="#36978D" />
}

const waitingEntry = () => {
    return <List.Icon icon="clock-outline" color="#6E47D5" />
}

const divider = () => <Divider leftInset={true} />

const listItem = (item: IEstimation, onPress?: (estimation: IEstimation) => void | undefined) => (
    <List.Item
        title={item.displayName}
        description={item.tags.join(",")}
        left={() =>
            (item.state === EstimationState.Failed) ? errorEntry()
                : (item.state === EstimationState.Success ? confirmEntry() : waitingEntry())
        }
        right={() => <Text variant="labelSmall">8m ago</Text>}
        style={{ minHeight: 100 }}
        onPress={() => onPress?.(item)} />
)

export const EndlessList: React.FC<EndlessListProps> = ({
    estimations,
    loadData,
    onPress,
    displaySpinner
}) => {
    return (
        <FlatList
            style={{ width: '95%', marginLeft: '2.5%' }}
            data={estimations}
            renderItem={({ item }) => listItem(item, onPress)}
            keyExtractor={(_item, index) => index.toString()}
            onEndReached={loadData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => displaySpinner ? <TextSpinner label='Getting your animations!' /> : null}
            ItemSeparatorComponent={divider}
        />
    );
};