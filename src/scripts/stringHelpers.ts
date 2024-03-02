export default class StringHelpers {

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

}