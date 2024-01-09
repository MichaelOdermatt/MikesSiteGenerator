import fs from 'fs';
import { MARKDOWN_FILE_NAME_REGEX } from './regex.js';

export default class FileHandler {

    /**
     * Returns the fileNames for all the markdown files in the given directory.
     * @param directoryPath The directory path that we wish to search.
     * @returns Returns all markdown file names in the directory.
     */
    public static retrieveMarkdownFileNames(directoryPath: string): string[] {
        const allFileNames = fs.readdirSync(directoryPath);
        return allFileNames.filter(file => file.match(MARKDOWN_FILE_NAME_REGEX));
    }

    /**
     * Reads the file and returns its contents.
     * @param filePath The file to read.
     * @returns The contents of the file.
     */
    public static readFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }

    /**
     * Copys the file to a new location
     * @param filePath The file to read.
     */
    public static copyFile(source: string, dest: string): void {
        fs.copyFileSync(source, dest);
    }

    /**
     * Writes the given content to the file at the given location.
     * @param filePath The file to write to.
     * @param content The content to write to the file.
     */
    public static writeFile(filePath: string, content: string): void {
        fs.writeFileSync(filePath, content);
    }
}