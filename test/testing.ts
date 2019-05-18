export function assert(condition: boolean) {
    if (condition) {
        return;
    }
    throw new Error("assert failed")
}
