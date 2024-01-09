import path from 'path';
import { MetadataEntry, MarkdownFile } from './types.js';
import ParseMarkdown from './parseMarkdown.js';
import { MARKDOWN_FILE_NAME_REGEX, METADATA_REGEX } from './regex.js';
import { STYLESHEET_ELEMENT_TEMPLATE, TEMPLATE_BODY_KEY, TEMPLATE_FILENAME_KEY, TEMPLATE_STYLESHEET_KEY, TEMPLATE_TITLE_KEY } from './htmlConstants.js';
import { CSS_DIRECTORY, MARKDOWN_DIRECTORY, OUTPUT_DIRECTORY, TEMPLATE_PATH } from './filePaths.js';
import FileHandler from './fileHandler.js';
import StringHelpers from './stringHelpers.js';

/**
 * Returns markdownFile for all the markdown files in the given directory.
 * @param directoryPath The directory path that we wish to search.
 */
function retreiveMarkdownFiles(directoryPath: string): MarkdownFile[] {
    const markdownFileNames = FileHandler.retrieveMarkdownFileNames(directoryPath);
    const markdownFiles: MarkdownFile[] = [];

    const processMarkdownFile = (fileName: string) => {
        // Read the file content and seperate the metadata and body sections into their 
        // own strings.
        const fileContent = FileHandler.readFile(path.join(directoryPath, fileName));
        const body = fileContent.replace(METADATA_REGEX, '');
        const rawMetadata = fileContent.match(METADATA_REGEX)[0];

        markdownFiles.push({
            fileName: fileName.replace(MARKDOWN_FILE_NAME_REGEX, ''),
            body: ParseMarkdown.convertContentToHTML(body),
            metadata: ParseMarkdown.getValuesFromMetadata(rawMetadata)
        });
    }

    markdownFileNames.forEach(processMarkdownFile);

    return markdownFiles;
}

/**
 * Inserts body and metadata into the base HTML template. Returns the filled out template.
 * @param template The HTML template.
 * @param body The body of the HTML template.
 * @param metadata The metadata for the HTML template.
 * @returns The filled out HTML template.
 */
function insertBodyIntoHTMLTemplate(template: string, body: string, metadata: MetadataEntry[]): string {
    template = template.replace(TEMPLATE_BODY_KEY, body);
    
    // Add title to the html template if there is a title included in the metadata.
    const title = metadata.find(entry => entry.key === 'title');
    const stylesheet = metadata.find(entry => entry.key === 'stylesheet');
    if (title) {
        StringHelpers.ensureListSizeOne(title.value);
        const titleString: string = title.value[0];
        template = template.replace(TEMPLATE_TITLE_KEY, titleString);
    }
    if (stylesheet) {
        StringHelpers.ensureListIsNotEmpty(stylesheet.value);
        template = addStylesheetsToHTMLTemplate(template, stylesheet.value);
    }

    return template;
}

/**
 * Inserts the stylesheets with the given stylsheetNames into the given HTML template.
 * @param template The HTML template.
 * @param stylesheetNames The stylesheet file names to add.
 * @returns The HTML template with with the stylesheets added.
 */
function addStylesheetsToHTMLTemplate(template: string, stylesheetNames: string[]): string {
    let stylesheetElements = '';

    const createStylesheetElement = (fileName: string) => {
        let element = stylesheetElements === '' ? '' : '\n\t';
        element += STYLESHEET_ELEMENT_TEMPLATE.replace(TEMPLATE_FILENAME_KEY, fileName);
        stylesheetElements += element
        // Copy the file into the _site/css directory.
        FileHandler.copyFile(`${CSS_DIRECTORY}/${fileName}.css`, `${OUTPUT_DIRECTORY}/css/${fileName}.css`);
    };

    stylesheetNames.forEach(createStylesheetElement);
    return template.replace(TEMPLATE_STYLESHEET_KEY, stylesheetElements);
}

/**
 * Main function which retrieves all markdown files in the markdown directory and converts them to 
 * html files in the output directory.
 */
function generate() {
    const markdownFiles = retreiveMarkdownFiles(MARKDOWN_DIRECTORY);
    markdownFiles.forEach(file => {
        let templateContent = FileHandler.readFile(TEMPLATE_PATH);
        let htmlContent = insertBodyIntoHTMLTemplate(templateContent, file.body, file.metadata);
        FileHandler.writeFile(`${OUTPUT_DIRECTORY}/${file.fileName}.html`, htmlContent);
    });
}

generate();