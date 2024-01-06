import path from 'path';
import ParseMarkdown from './parseMarkdown.js';
import { CSS_FILE_NAME_REGEX, MARKDOWN_FILE_NAME_REGEX, METADATA_REGEX } from './regex.js';
import { STYLESHEET_ELEMENT_TEMPLATE, TEMPLATE_BODY_KEY, TEMPLATE_FILENAME_KEY, TEMPLATE_STYLESHEET_KEY, TEMPLATE_TITLE_KEY } from './htmlConstants.js';
import { CSS_DIRECTORY, MARKDOWN_DIRECTORY, OUTPUT_DIRECTORY, TEMPLATE_PATH } from './filePaths.js';
import FileHandler from './fileHandler.js';
/**
 * Returns markdownFile for all the markdown files in the given directory.
 * @param directoryPath The directory path that we wish to search.
 */
function retreiveMarkdownFiles(directoryPath) {
    const markdownFileNames = FileHandler.retrieveMarkdownFileNames(directoryPath);
    const markdownFiles = [];
    const processMarkdownFile = (fileName) => {
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
    };
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
function insertBodyIntoHTMLTemplate(template, body, metadata) {
    template = template.replace(TEMPLATE_BODY_KEY, body);
    // Add title to the html template if there is a title included in the metadata.
    const title = metadata.find(entry => entry.key === 'title');
    if (title) {
        template = template.replace(TEMPLATE_TITLE_KEY, title.value);
    }
    return template;
}
/**
 * Inserts the stylesheets into the HTML template.
 * @param template The HTML template
 * @returns The HTML template with with the stylesheets added.
 */
function addStylesheetsToHTMLTemplate(template) {
    const allFileNames = FileHandler.retrieveCSSFileNames(CSS_DIRECTORY);
    let stylesheetElements = '';
    const cssFileNames = allFileNames.filter(file => file.match(CSS_FILE_NAME_REGEX));
    const createStylesheetElement = (fileName) => {
        let element = stylesheetElements === '' ? '' : '\n\t';
        element += STYLESHEET_ELEMENT_TEMPLATE.replace(TEMPLATE_FILENAME_KEY, fileName);
        stylesheetElements += element;
        // Copy the file into the _site directory.
        FileHandler.copyFile(`${CSS_DIRECTORY}/${fileName}`, `${OUTPUT_DIRECTORY}/css/${fileName}`);
    };
    cssFileNames.forEach(createStylesheetElement);
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
        htmlContent = addStylesheetsToHTMLTemplate(htmlContent);
        FileHandler.writeFile(`${OUTPUT_DIRECTORY}/${file.fileName}.html`, htmlContent);
    });
}
// TODO is there a way to remove the .html at the end of page urls?
generate();
//# sourceMappingURL=index.js.map