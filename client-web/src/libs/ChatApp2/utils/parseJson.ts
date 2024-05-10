export function parseJSON(s: string): any {
    try {
        return JSON.parse(s)
    } catch (e) {
        return null
    }
}