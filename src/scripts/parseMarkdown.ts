import { CLEAN_METADATA_REGEX } from './regex.js';
import { MetadataEntry } from './types.js';

/**
 * Function to be used for parsing markdown files.
 */
export default class ParseMarkdown {

    /**
     * Parses the given block of metadata and seperates it into key value pairs.
     * @param metadata Block of metadata.
     * @returns Parsed metadata values.
     */
    public static getValuesFromMetadata(metadata: string): MetadataEntry[] {
        // Get all the lines from the metadata block to process individually.
        const lines = metadata.split('\n');

        // Remove the first and last lines which are both '---'
        lines.shift();
        lines.pop();

        // Split the lines into two segments and trim any whitespaces or unwanted characters
        // before returning as a metadataEntry object.
        return lines.map(line => {
            let segments = line.split(':');
            segments = segments.map(segment => segment.trim().replace(CLEAN_METADATA_REGEX, ''));
            return {
                key: segments[0],
                value: segments[1],
            }
        })
    }

    /**
     * Parses the file content to format it correctly into HTML.
     * @param content The content of the HTML file.
     * @returns The formatted content.
     */
    public static convertContentToHTML(content: string): string {
        const lines = content.trim().split('\n');
        let output = '';
        lines.forEach((line: string) => {
            // Wrap each line that isn't empty in a p tag.
            line = line.trim();
            if (line.length > 0) {
                output += `<p>${line}</p>`
            }
        });

        return output;
    }
}
