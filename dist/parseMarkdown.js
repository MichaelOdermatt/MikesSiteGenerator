import { CLEAN_METADATA_REGEX, DOUBLE_LINE_BREAK_REGEX, HEADER_LINE_REGEX, HTML_CLOSING_TAG_REGEX } from './regex.js';
import StringHelpers from './stringHelpers.js';
/**
 * Function to be used for parsing markdown files.
 */
export default class ParseMarkdown {
    /**
     * Parses the given block of metadata and seperates it into key value pairs.
     * @param metadata Block of metadata.
     * @returns Parsed metadata values.
     */
    static getValuesFromMetadata(metadata) {
        // Get all the lines from the metadata block to process individually.
        const lines = metadata.split('\n');
        // Remove the first and last lines which are both '---'
        lines.shift();
        lines.pop();
        return lines.map(ParseMarkdown.processMetadataLine);
    }
    /**
     * Takes the given line, splits it into two segments, trims any whitespace or
     * unwanted characters. And returns the result.
     * @param line The line of metadata.
     * @returns The metadata entry object.
     */
    static processMetadataLine(line) {
        let segments = line.split(':');
        // Remove any unwanted characters from the metadata's key.
        const key = segments[0].trim().replace(CLEAN_METADATA_REGEX, '');
        let values = segments[1].split(',');
        // Remove any unwanted characters from the metadata's values.
        values = values.map(value => value.trim().replace(CLEAN_METADATA_REGEX, ''));
        return {
            key,
            value: values
        };
    }
    /**
     * Translates a string from Markdown header format to HTML header format.
     * @param line The input string to be translated.
     * @returns Returns the HTML header if the input was a Markdown header,
     * otherwise returns the original string.
     */
    static attemptToTranslateHeader(line) {
        if (!HEADER_LINE_REGEX.test(line)) {
            return line;
        }
        const words = line.split(' ');
        const headerSize = words[0].length;
        const headerContent = line.substring(headerSize + 1).trim();
        return `<h${headerSize}>${headerContent}</h${headerSize}>`;
    }
    /**
     * Converts the content of the file into HTML paragraph elements, excluding any HTML
     * elements encountered in the file content from being encapsulated within a paragraph element.
     * @param content The content of the HTML file.
     * @returns The formatted content.
     */
    static convertContentToHTML(content) {
        content = content.trim();
        let output = '';
        let lines = content.split('\n');
        lines = lines.map(line => ParseMarkdown.attemptToTranslateHeader(line));
        content = lines.join('\n');
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
            /**
             * Get the content of the paragraph block,
             * then remove that block from the main content string.
             */
            let block = content.substring(0, firstSubstringLocation.index);
            content = content.replace(block, '');
            switch (firstSubstringLocation.searchString) {
                case DOUBLE_LINE_BREAK_REGEX:
                    /**
                     * There is a possibility that the block is an empty string. If that's the case
                     * then don't add it to the output.
                     */
                    if (block.length > 0) {
                        output += `<p>${block.trim()}</p>\n`;
                    }
                    content = content.replace(DOUBLE_LINE_BREAK_REGEX, '');
                    break;
                case HTML_CLOSING_TAG_REGEX:
                    /**
                     * Make sure to add the closing tag to the end of the block,
                     * as it will be missing the closing tag.
                     */
                    block += HTML_CLOSING_TAG_REGEX.exec(content)[0];
                    output += `${block}\n`;
                    content = content.replace(HTML_CLOSING_TAG_REGEX, '');
                    break;
            }
        }
        return output;
    }
}
//# sourceMappingURL=parseMarkdown.js.map