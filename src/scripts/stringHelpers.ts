import { SubstringLocation } from "./types.js";

export default class StringHelpers {

    /**
     * Accepts a string and a list of search values, then provides a list of objects containing the 
     * located search values along with their corresponding indices in the string.
     * @param stringToSearch The string to search.
     * @param searchStrings The substrings or regex to search for in the given string.
     * @returns
     */
    public static getIndices(stringToSearch: string, searchStrings: (string | RegExp)[]): SubstringLocation[] {
        let substringLocations = searchStrings.map(searchString => {
            return {
                searchString,
                index: stringToSearch.search(searchString),
            }
        });
        substringLocations = substringLocations.filter(substringLocation => substringLocation.index !== -1)
        substringLocations.sort(StringHelpers.compareSubstringLocations);
        return substringLocations;
    }

    /**
     * Throws an exception if the given list is not of size 1.
     * @param strings A list of strings to check.
     */
    public static ensureListSizeOne(strings: string[]) {
        if (strings.length !== 1) {
            throw Error('The given list of strings should only contain one element.');
        }
    }

    /**
     * Throws an exception if the given list is empty.
     * @param strings A list of strings to check.
     */
    public static ensureListIsNotEmpty(strings: string[]) {
        if (strings.length === 0) {
            throw Error('The given list of strings should not be empty.');
        }
    }

    /**
     * A comparison function for SubstringLocation objects.
     */
    private static compareSubstringLocations(a: SubstringLocation, b: SubstringLocation): number {
        if (a.index < b.index) {
            return -1;
        }
        if (a.index > b.index) {
            return 1;
        }
        return 0;
    }
}