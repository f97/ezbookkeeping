// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
}

export interface TypeAndName {
    readonly type: number;
    readonly name: string;
}

export interface TypeAndDisplayName {
    readonly type: number;
    readonly displayName: string;
}
