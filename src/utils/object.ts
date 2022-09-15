/**
 * Function getCircularReplacer() : Reduce circular references.
 *
 * @copyright https://stackoverflow.com/a/53731154
 */
export const getCircularReplacer = () => {
    const seen = new WeakSet()

    return ( key: any, value: any ) => {
        if ( typeof value === "object" && value !== null ) {
            if ( seen.has( value ) ) {
                return
            }
            seen.add( value )
        }
        return value
    }
}
