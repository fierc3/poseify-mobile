import { ViewStyle } from "react-native";
import { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { AttachmentType, IEstimation } from "../../../helpers/api.types";

export type iconButtonProps = {
    onPress?: () => void,
    iconColor?: string,
    icon?: string,
    text: string,
    containerStyle?: StyleProp<ViewStyle> | undefined,
    disabled?: boolean,
    iconSize?: number
};

export type shareFileButtonProps = iconButtonProps & {
    onShareFinished?: () => void,
    estimation: IEstimation,
    attachmentType: AttachmentType
};