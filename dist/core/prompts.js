/**
 * Register all prompts with the MCP server
 * @param server The FastMCP server instance
 */
export function registerPrompts(server) {
    // Example prompt
    server.addPrompt({
        name: "greeting",
        description: "A simple greeting prompt",
        arguments: [
            {
                name: "name",
                description: "Name to greet",
                required: true,
            },
        ],
        load: async ({ name }) => {
            return `Hello, ${name}! How can I help you today?`;
        }
    });
}
//# sourceMappingURL=prompts.js.map