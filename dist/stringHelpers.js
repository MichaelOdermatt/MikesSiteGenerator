export default class StringHelpers {
    /**
     * Accepts a string and a list of search values, then provides a list of objects containing the
     * located search values along with their corresponding indices in the string.
     * @param stringToSearch The string to search.
     * @param searchStrings The substrings or regex to search for in the given string.
     * @returns
     */
    static getIndices(stringToSearch, searchStrings) {
        let substringLocations = searchStrings.map(searchString => {
            return {
                searchString,
                index: stringToSearch.search(searchString),
            };
        });
        substringLocations = substringLocations.filter(substringLocation => substringLocation.index !== -1);
        substringLocations.sort(StringHelpers.compareSubstringLocations);
        return substringLocations;
    }
    /**
     * A comparison function for SubstringLocation objects.
     */
    static compareSubstringLocations(a, b) {
        if (a.index < b.index) {
            return -1;
        }
        if (a.index > b.index) {
            return 1;
        }
        return 0;
    }
}
//# sourceMappingURL=stringHelpers.js.map