import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";

/**
 * Register all tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {


  // Image tool powered by picsum.photos
  server.addTool({
    name: "image",
    description: "Generate or fetch images from picsum.photos with various options",
    parameters: z.object({
      width: z.number().int().positive().optional().describe("The width of the image in pixels"),
      height: z.number().int().positive().optional().describe("The height of the image in pixels"),
      id: z.string().optional().describe("The ID of a specific image to retrieve"),
      seed: z.string().optional().describe("A seed for generating a static random image"),
      grayscale: z.boolean().optional().describe("Apply grayscale filter to the image"),
      blur: z.number().int().min(1).max(10).optional().describe("Apply blur filter (1-10)"),
      format: z.enum(["jpg", "webp"]).optional().describe("Image format"),
      output: z.enum(["url", "file"]).default("url").describe("Output type: url returns string URL, file returns binary data"),
      list: z.boolean().optional().describe("Fetch list of available images"),
      page: z.number().int().positive().optional().describe("Page number for list results"),
      limit: z.number().int().positive().optional().describe("Number of results per page for list"),
      info: z.boolean().optional().describe("Fetch metadata for a specific image")
    }),
    execute: async (params) => {
      return await services.ImageService.generateImage(params);
    }
  });
}