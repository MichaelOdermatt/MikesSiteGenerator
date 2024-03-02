import path from 'path';
import { MetadataEntry, MarkdownFile, LinkFileType } from './types.js';
import ParseMarkdown from './parseMarkdown.js';
import { MARKDOWN_FILE_NAME_REGEX, METADATA_REGEX } from './regex.js';
import { SCRIPT_ELEMENT_TEMPLATE, STYLESHEET_ELEMENT_TEMPLATE, TEMPLATE_BODY_KEY, TEMPLATE_FILENAME_KEY, TEMPLATE_SCRIPT_KEY, TEMPLATE_STYLESHEET_KEY, TEMPLATE_TITLE_KEY } from './htmlConstants.js';
import { CSS_DIRECTORY, CSS_OUTPUT_DIRECTORY, HTML_OUTPUT_DIRECTORY, JS_DIRECTORY, JS_OUTPUT_DIRECTORY, MARKDOWN_DIRECTORY, TEMPLATE_PATH } from './filePaths.js';
import FileHandler from './fileHandler.js';
import StringHelpers from './stringHelpers.js';

/**
 * Returns markdownFile for all the markdown files in the given directory.
 * @param directoryPath The directory path that we wish to search.
 */
async function retreiveMarkdownFiles(directoryPath: string): Promise<MarkdownFile[]> {
    const markdownFileNames = FileHandler.retrieveMarkdownFileNames(directoryPath);
    const markdownFiles: MarkdownFile[] = [];

    const processMarkdownFile = async (fileName: string) => {
        // Read the file content and seperate the metadata and body sections into their 
        // own strings.
        const fileContent = FileHandler.readFile(path.join(directoryPath, fileName));
        const body = fileContent.replace(METADATA_REGEX, '');
        const rawMetadata = fileContent.match(METADATA_REGEX)[0];

        markdownFiles.push({
            fileName: fileName.replace(MARKDOWN_FILE_NAME_REGEX, ''),
            body: await ParseMarkdown.convertMarkdownToHTML(body),
            metadata: ParseMarkdown.getMetadataEntries(rawMetadata)
        });
    }

    markdownFileNames.forEach(await processMarkdownFile);

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
    const script = metadata.find(entry => entry.key === 'scripts');
    if (title) {
        StringHelpers.ensureListSizeOne(title.value);
        const titleString: string = title.value[0];
        template = template.replace(TEMPLATE_TITLE_KEY, titleString);
    }

    if (stylesheet) {
        StringHelpers.ensureListIsNotEmpty(stylesheet.value);
        template = linkFileToHTMLTemplate(template, stylesheet.value, LinkFileType.css);
    } else {
        template.replace(TEMPLATE_STYLESHEET_KEY, '');
    }

    if (script) {
        StringHelpers.ensureListIsNotEmpty(script.value);
        template = linkFileToHTMLTemplate(template, script.value, LinkFileType.js);
    } else {
        template = template.replace(TEMPLATE_SCRIPT_KEY, '');
    }

    return template;
}

/**
 * Links the specified file to given HTML template.
 * @param template The HTML template.
 * @param fileNames The file names to add.
 * @param fileType The type of the file to link to the html template.
 * @returns The HTML template with with the link elements added.
 */
function linkFileToHTMLTemplate(template: string, fileNames: string[], fileType: LinkFileType): string {
    const linkElementTemplate = fileType == LinkFileType.css ? STYLESHEET_ELEMENT_TEMPLATE : SCRIPT_ELEMENT_TEMPLATE;
    const fileDirectory = fileType == LinkFileType.css ? CSS_DIRECTORY : JS_DIRECTORY;
    const outputDirectory = fileType == LinkFileType.css ? CSS_OUTPUT_DIRECTORY : JS_OUTPUT_DIRECTORY;
    const templateKey = fileType == LinkFileType.css ? TEMPLATE_STYLESHEET_KEY : TEMPLATE_SCRIPT_KEY;
    const fileExtension = fileType == LinkFileType.css ? '.css' : '.js';

    let linkElements = '';

    const createStylesheetElement = (fileName: string) => {
        let element = linkElements === '' ? '' : '\n\t';
        element += linkElementTemplate.replace(TEMPLATE_FILENAME_KEY, fileName);
        linkElements += element
        FileHandler.copyFile(`${fileDirectory}/${fileName}${fileExtension}`, `${outputDirectory}/${fileName}${fileExtension}`);
    };

    fileNames.forEach(createStylesheetElement);
    return template.replace(templateKey, linkElements);
}

/**
 * Main function which retrieves all markdown files in the markdown directory and converts them to 
 * html files in the output directory.
 */
async function generate() {
    const markdownFiles = await retreiveMarkdownFiles(MARKDOWN_DIRECTORY);
    markdownFiles.forEach(file => {
        let templateContent = FileHandler.readFile(TEMPLATE_PATH);
        let htmlContent = insertBodyIntoHTMLTemplate(templateContent, file.body, file.metadata);
        FileHandler.writeFile(`${HTML_OUTPUT_DIRECTORY}/${file.fileName}.html`, htmlContent);
    });
}

generate();