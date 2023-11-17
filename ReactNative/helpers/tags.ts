
export type Tag = {
    value: string,
    label: string,
    icon: string
}

export const DefaultTags: Tag[] = [
    {
        value: 'Research',
        label: 'Research',
        icon: 'desktop-classic'
    },
    {
        value: 'Sports',
        label: 'Sports',
        icon: 'arm-flex'
    },
    {
        value: 'Dance',
        label: 'Dance',
        icon: 'human-female-dance'
    },
    {
        value: 'Animation',
        label: 'Animation',
        icon: 'controller-classic'
    }
];

export const getIconName = (tag: string) => {
    return DefaultTags.find((d) => d.value === tag)?.icon ?? 'alien'
}
