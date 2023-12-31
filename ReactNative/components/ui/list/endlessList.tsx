import { FlatList } from "react-native";
import { EstimationState, IEstimation } from "../../../helpers/api.types";
import { Divider, Icon, List, Text } from "react-native-paper";
import { TextSpinner } from "../loading/textSpinner";
import moment from 'moment-timezone';
import { getIconName } from "../../../helpers/tags";

type EndlessListProps = {
    estimations: IEstimation[],
    loadData: () => any,
    open?: (estimation: IEstimation) => void | undefined,
    info?: (estimation: IEstimation) => void | undefined,
    displaySpinner: boolean
}

const errorEntry = () => {
    return <List.Icon icon="exclamation" color="#DF6E49" />
}

const confirmEntry = () => {
    return <List.Icon icon="check" color="#36978D" />
}

const queuedEntry = () => {
    return <List.Icon icon="clock-outline" color="#6E47D5" />
}

const processingEntry = () => {
    return <List.Icon icon="progress-wrench" color="#6E47D5" />
}

const divider = () => <Divider leftInset={true} />

const listItem = (item: IEstimation, onPress?: (estimation: IEstimation) => void | undefined) => {
    moment.tz.setDefault("Europe/Zurich");
    const fullTags = (item.tags[0] ?? '').split(","); // this is a workaround, and a bug in the backend, I think....

    return <List.Item
        title={item.displayName}
        descriptionStyle={{ width: '70%', paddingTop: 5 }}
        description={
            fullTags.filter(tag => tag.length > 0).map((tag, i) => (<Text key={i} variant="labelSmall" ><Icon color="red" size={14} source={getIconName(tag)} />{tag} {fullTags.length == i + 1 ? '' : '|'}</Text>))}
        left={() =>
            (item.state === EstimationState.Failed) ? errorEntry()
                : (item.state === EstimationState.Success ? confirmEntry()
                    : (item.state === EstimationState.Processing ? processingEntry()
                        : queuedEntry())
                )
        }
        right={() => <Text variant="labelSmall">{moment(item.modifiedDate).fromNow()}</Text>}
        style={{ minHeight: 100 }}
        onPress={() => onPress?.(item)} />
}

export const EndlessList: React.FC<EndlessListProps> = ({
    estimations,
    open,
    info,
    displaySpinner
}) => {
    return (
        <FlatList
            style={{ width: '95%', marginLeft: '2.5%' }}
            data={estimations}
            renderItem={({ item }) => listItem(item, item.state === EstimationState.Success ? open : info)}
            keyExtractor={(_item, index) => index.toString()}
            ListFooterComponent={() => displaySpinner ? <TextSpinner label='Getting your animations!' /> : null}
            ItemSeparatorComponent={divider}
        />
    );
};