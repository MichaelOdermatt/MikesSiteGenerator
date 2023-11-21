export interface MetadataEntry {
    key: string,
    value: string,
}

export interface MarkdownFile {
    fileName: string;
    body: string;
    metadata: MetadataEntry[];
}