import { ViewStyle } from "react-native";
import { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { AttachmentType, IEstimation } from "../../../helpers/api.types";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";

export type iconButtonProps = {
    onPress?: () => void,
    iconColor?: string,
    icon?: string,
    text: string,
    containerStyle?: StyleProp<ViewStyle> | undefined,
    disabled?: boolean,
    iconSize?: number,
    variant?: VariantProp<any>
};

export type shareFileButtonProps = iconButtonProps & {
    onShareFinished?: () => void,
    estimation: IEstimation,
    attachmentType: AttachmentType
};