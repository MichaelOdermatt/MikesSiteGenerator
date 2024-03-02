import { CLEAN_METADATA_REGEX } from './regex.js';
import { MetadataEntry } from './types.js';
import { marked } from 'marked';

/**
 * Class used for parsing markdown files.
 */
export default class ParseMarkdown {

    /**
     * Parses the given block of metadata and seperates it into key value pairs.
     * @param metadata Block of metadata.
     * @returns Parsed metadata values.
     */
    public static getMetadataEntries(metadata: string): MetadataEntry[] {
        // Get all the lines from the metadata block to process individually.
        const lines = metadata.split('\n');

        // Remove the first and last lines which are both '---'
        lines.shift();
        lines.pop();

        return lines.map(ParseMarkdown.processMetadataLine)
    }

    /**
     * Takes the given line, splits it into two segments, trims any whitespace or
     * unwanted characters. And returns the result.
     * @param line The line of metadata.
     * @returns The metadata entry object.
     */
    private static processMetadataLine(line: string): MetadataEntry {
        let segments = line.split(':');

        // Remove any unwanted characters from the metadata's key.
        const key = segments[0].trim().replace(CLEAN_METADATA_REGEX, '');
        let values = segments[1].split(',');

        // Remove any unwanted characters from the metadata's values.
        values = values.map(value => value.trim().replace(CLEAN_METADATA_REGEX, ''));
        return {
            key,
            value: values
        }
    }

    /**
     * Converts the given string from markdown to HTML.
     * @param content The content of the HTML file.
     * @returns The formatted content.
     */
    public static async convertMarkdownToHTML(content: string): Promise<string> {
        return await marked.parse(content);
    }
}
