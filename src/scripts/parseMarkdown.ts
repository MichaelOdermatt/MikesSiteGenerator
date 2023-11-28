import { CLEAN_METADATA_REGEX, DOUBLE_LINE_BREAK_REGEX, HTML_CLOSING_TAG_REGEX } from './regex.js';
import StringHelpers from './stringHelpers.js';
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
     * Converts the content of the file into HTML paragraph elements, excluding any HTML 
     * elements encountered in the file content from being encapsulated within a paragraph element.
     * @param content The content of the HTML file.
     * @returns The formatted content.
     */
    public static convertContentToHTML(content: string): string {
        content = content.trim();
        let output = '';

        while (content != '') {
            // Search the string for anything that denotes the end of a paragraph block.
            const substringLocations = StringHelpers.getIndices(content, [
                DOUBLE_LINE_BREAK_REGEX,
                HTML_CLOSING_TAG_REGEX,
            ]);
            if (substringLocations.length === 0) {
                output += `<p>${content}</p>`;
                break;
            }

            const firstSubstringLocation = substringLocations[0];
            // Get the content of the paragraph block,
            // then remove that block from the main content string.
            let block = content.substring(0, firstSubstringLocation.index);
            content = content.replace(block, '');

            switch (firstSubstringLocation.searchString) {
                case DOUBLE_LINE_BREAK_REGEX:
                    output += `<p>${block}</p>`;
                    content = content.replace(DOUBLE_LINE_BREAK_REGEX, '');
                    break;
                case HTML_CLOSING_TAG_REGEX:
                    // Make sure to add the closing tag to the end of the block,
                    // as it will be missing the closing tag.
                    block += HTML_CLOSING_TAG_REGEX.exec(content)[0];
                    output += block;
                    content = content.replace(HTML_CLOSING_TAG_REGEX, '');
                    break;
            }
        }

        return output;
    }
}
