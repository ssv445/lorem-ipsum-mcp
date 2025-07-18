# lorem-ipsum-mcp
An lorem ipsum MCP server

## Installation

Install the package globally with npm:

```bash
npm install -g lorem-ipsum-mcp
```

Or run directly with npx:

```bash
npx lorem-ipsum-mcp
```

## Usage

The MCP server runs on stdio and is designed to be used as a Model Context Protocol server:

```bash
# Run directly if installed globally
lorem-ipsum-mcp

# Run with npx (no installation required)
npx lorem-ipsum-mcp
```

The HTTP server runs on `http://localhost:3001` with the SSE endpoint at `http://localhost:3001/sse`.

## Testing

This project includes comprehensive automated testing using GitHub Actions. For detailed testing information, see [docs/TESTING.md](docs/TESTING.md).

## Available Tools

### image
Generate or fetch images from picsum.photos with various options.

**Usage Examples:**
- Get URL for a random 200x300 image: `image --width 200 --height 300`
- Get image file for a random 200x300 image: `image --width 200 --height 300 --output file`
- Get URL for a specific, grayscaled, and blurred image: `image --id 870 --grayscale --blur 2 --width 200 --height 300`
- List available images: `image --list --page 2 --limit 50`
- Get metadata for a specific image: `image --info --id 0`

**Parameters:**
- `--width` (integer): The width of the image in pixels
- `--height` (integer): The height of the image in pixels  
- `--id` (string): The ID of a specific image to retrieve
- `--seed` (string): A seed for generating a static random image
- `--grayscale` (boolean): Apply grayscale filter to the image
- `--blur` (integer 1-10): Apply blur filter with specified radius
- `--format` (jpg|webp): Image format
- `--output` (url|file): Output type - url returns string URL, file returns binary data (default: url)
- `--list` (boolean): Fetch list of available images
- `--page` (integer): Page number for list results
- `--limit` (integer): Number of results per page for list
- `--info` (boolean): Fetch metadata for a specific image
