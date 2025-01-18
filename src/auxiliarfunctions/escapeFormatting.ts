export default async function escapeFormatting(input: string): Promise<string> {
    return input
        .replace(/_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
}