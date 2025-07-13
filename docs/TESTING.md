# MCP Server Testing

This repository includes automated testing for the MCP (Model Context Protocol) server using GitHub Actions.

## Workflow: MCP Server Test

The `.github/workflows/mcp-test.yml` workflow automatically tests the MCP server on every push and pull request to the main branch.

### What it tests:

1. **Build and Dependencies**: Ensures the project builds correctly and all dependencies are installed
2. **Existing Tests**: Runs the existing test suite (55 tests)
3. **FastMCP CLI Testing**: Tests the server using the fastmcp development CLI
4. **MCP Inspector**: Validates server connectivity using the MCP Inspector tool
5. **HTTP Endpoint Testing**: Verifies the SSE (Server-Sent Events) endpoint responds correctly
6. **Server Instance Verification**: Confirms the server can be instantiated properly

### API Key Configuration (Optional)

For full testing capabilities with Anthropic's API:

1. Go to your repository's `Settings > Secrets and variables > Actions`
2. Create a new repository secret named `ANTHROPIC_API_KEY`
3. Add your Anthropic API key as the value

The workflow is designed to work without the API key for basic functionality testing.

### Manual Testing

You can also test the MCP server manually:

```bash
# Install dependencies
npm ci

# Build the project
npm run build

# Run tests
npm test

# Test with FastMCP CLI
npx fastmcp dev src/index.ts

# Test with MCP Inspector (opens web UI)
npx fastmcp inspect src/index.ts

# Start HTTP server for testing
npm run start:http
```

The HTTP server runs on `http://localhost:3001` with the SSE endpoint at `http://localhost:3001/sse`.