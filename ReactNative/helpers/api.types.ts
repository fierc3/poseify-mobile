// The match the types from the webiui, maybe we can sync then in the future somehow.
// Sync only makes sense as long as they share the same BFF

export interface IProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
    extensions?: { [key: string]: Object; } | undefined;
    [key: string]: any;
}

export enum EstimationState{
    Success = "Success",
    Processing ="Processing",
    Failed = "Failed",
    Queued ="Queued",
}

export interface IEstimation {
    internalGuid: string;
    displayName: string;
    tags: string[];
    uploadingProfile: string;
    modifiedDate: Date;
    state: EstimationState,
    stateText: string
}

export enum AttachmentType{
    Joints = "Joints",
    Preview ="Preview",
    Npz = "Npz",
    Bvh = "Bvh",
    Fbx = "Fbx"
}

export interface IUserProfile {
    displayName: string,
    token: string,
    imageurl: string
}

export type ServerStatus = 'Unknown' | 'Offline' | 'Online'