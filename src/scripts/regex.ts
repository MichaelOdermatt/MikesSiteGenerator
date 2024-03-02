/**
 * Matches any character that is either a hyphen, tab, or newline.
 */ 
export const CLEAN_METADATA_REGEX = /[-\r\n]/g;
export const MARKDOWN_FILE_NAME_REGEX = /\.(md|markdown)$/i;
export const METADATA_REGEX = /^---([\s\S]*?)---/;