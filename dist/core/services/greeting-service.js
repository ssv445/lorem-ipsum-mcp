/**
 * A simple service for generating greetings
 */
export class GreetingService {
    /**
     * Generate a greeting message
     * @param name The name to greet
     * @returns A greeting message
     */
    static generateGreeting(name) {
        return `Hello, ${name}! Welcome to the MCP Server.`;
    }
    /**
     * Generate a farewell message
     * @param name The name to bid farewell to
     * @returns A farewell message
     */
    static generateFarewell(name) {
        return `Goodbye, ${name}! Thank you for using the MCP Server.`;
    }
}
//# sourceMappingURL=greeting-service.js.map