export const lowerCase = (tags: string[]): string[] => {
    tags.map(value => {
        value.toLowerCase()
    });
    return tags
}