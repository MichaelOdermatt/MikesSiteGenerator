export interface MetadataEntry {
    key: string,
    value: string[],
}

export interface MarkdownFile {
    fileName: string;
    body: string;
    metadata: MetadataEntry[];
}

export interface SubstringLocation {
    searchString: string | RegExp;
    index: number;
}

export enum LinkFileType {
    js,
    css,
}