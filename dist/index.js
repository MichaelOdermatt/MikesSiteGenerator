import path from 'path';
import fs from 'fs';
const MARKDOWN_REGEX = /\.(md|markdown)$/i;
const METADATA_REGEX = /^---([\s\S]*?)---/;
const CLEAN_METADATA_REGEX = /[-\r\n]/g;
const OUTPUT_DIRECTORY = './_site';
const MARKDOWN_DIRECTORY = './markdown';
const TEMPLATE_PATH = './src/base.html';
const TEMPLATE_BODY_KEY = '{% block content %}';
const TEMPLATE_TITLE_KEY = '{{ title }}';
/**
 * Parses the given block of metadata and seperates it into key value pairs.
 * @param metadata Block of metadata.
 * @returns Parsed metadata values.
 */
function getValuesFromMetadata(metadata) {
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
        };
    });
}
/**
 * Returns markdownFile for all the markdown files in the given directory.
 * @param directoryPath The directory path that we wish to search.
 */
function retreiveMarkdownFiles(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
            }
            const fileNames = files.filter(file => file.match(MARKDOWN_REGEX));
            const markdownFiles = fileNames.map((fileName) => {
                const fileContent = fs.readFileSync(path.join(directoryPath, fileName), 'utf-8');
                const body = fileContent.replace(METADATA_REGEX, '');
                const rawMetadata = fileContent.match(METADATA_REGEX)[0];
                return {
                    fileName: fileName.replace(MARKDOWN_REGEX, ''),
                    body,
                    metadata: getValuesFromMetadata(rawMetadata)
                };
            });
            resolve(markdownFiles);
        });
    });
}
/**
 * Creates an html file from the given markdown file in the given output directory.
 * @param fileName The name of the HTML file.
 * @param content The content for the HTML file.
 * @param outputDir The output directory of the html file.
 */
function createHTMLFile(fileName, content, outputDir) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${outputDir}/${fileName}.html`, content, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
/**
 * Inserts values into the base HTML template. and returns the filled out template.
 * @param body The body of the HTML template.
 * @param metadata The metadata for the HTML template.
 * @returns The filled out HTML template.
 */
async function insertIntoHTMLTemplate(body, metadata) {
    let templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    templateContent = templateContent.replace(TEMPLATE_BODY_KEY, body);
    // add title to the html template
    const title = metadata.find(entry => entry.key === 'title');
    if (title) {
        templateContent = templateContent.replace(TEMPLATE_TITLE_KEY, title.value);
    }
    return templateContent;
}
/**
 * Retrieves all markdown files in the markdown directory and converts them to html files in
 * the output directory.
 */
async function generate() {
    const markdownFiles = await retreiveMarkdownFiles(MARKDOWN_DIRECTORY);
    markdownFiles.forEach(async (file) => {
        const htmlContent = await insertIntoHTMLTemplate(file.body, file.metadata);
        createHTMLFile(file.fileName, htmlContent, OUTPUT_DIRECTORY);
    });
}
generate();
//# sourceMappingURL=index.js.map