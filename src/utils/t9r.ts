export function t9r(template: string, interpolations: Record<string, any>) {
    return template.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (_, token) => interpolations[token]);
}