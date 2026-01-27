export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')     // remove everything except letters, numbers, spaces, hyphens
        .trim()
        .replace(/\s+/g, '-')             // spaces → single hyphen
        .replace(/-+/g, '-');             // no double hyphens
}