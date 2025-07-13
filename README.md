# lorem-ipsum-mcp
An lorem ipsum MCP server

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
