import path from 'path';
import fs from 'fs';
import ParseMarkdown from './parseMarkdown.js';
import { MARKDOWN_FILE_NAME_REGEX, METADATA_REGEX } from './regex.js';
const OUTPUT_DIRECTORY = './_site';
const MARKDOWN_DIRECTORY = './markdown';
const TEMPLATE_PATH = './src/base.html';
const TEMPLATE_BODY_KEY = '{% block content %}';
const TEMPLATE_TITLE_KEY = '{{ title }}';
/**
 * Returns markdownFile for all the markdown files in the given directory.
 * @param directoryPath The directory path that we wish to search.
 */
function retreiveMarkdownFiles(directoryPath) {
    const allFileNames = fs.readdirSync(directoryPath);
    const markdownFileNames = allFileNames.filter(file => file.match(MARKDOWN_FILE_NAME_REGEX));
    const markdownFiles = [];
    const processMarkdownFile = (fileName) => {
        // Read the file content and seperate the metadata and body sections into their 
        // own strings.
        const fileContent = fs.readFileSync(path.join(directoryPath, fileName), 'utf-8');
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
 * Creates an html file from the given markdown file in the given output directory.
 * @param fileName The name of the HTML file.
 * @param content The content for the HTML file.
 * @param outputDir The output directory of the html file.
 */
function createHTMLFile(fileName, content, outputDir) {
    fs.writeFileSync(`${outputDir}/${fileName}.html`, content);
}
/**
 * Inserts values into the base HTML template. Returns the filled out template.
 * @param body The body of the HTML template.
 * @param metadata The metadata for the HTML template.
 * @returns The filled out HTML template.
 */
function insertIntoHTMLTemplate(body, metadata) {
    let templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    templateContent = templateContent.replace(TEMPLATE_BODY_KEY, body);
    // Add title to the html template if there is a title included in the metadata.
    const title = metadata.find(entry => entry.key === 'title');
    if (title) {
        templateContent = templateContent.replace(TEMPLATE_TITLE_KEY, title.value);
    }
    return templateContent;
}
/**
 * Main function which retrieves all markdown files in the markdown directory and converts them to
 * html files in the output directory.
 */
async function generate() {
    const markdownFiles = retreiveMarkdownFiles(MARKDOWN_DIRECTORY);
    markdownFiles.forEach(async (file) => {
        const htmlContent = insertIntoHTMLTemplate(file.body, file.metadata);
        createHTMLFile(file.fileName, htmlContent, OUTPUT_DIRECTORY);
    });
}
generate();
//# sourceMappingURL=index.js.map