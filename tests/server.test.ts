import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FastMCP } from 'fastmcp';
import startServer from '../src/server/server';

// Mock the dependencies
vi.mock('fastmcp');
vi.mock('../src/core/resources', () => ({
  registerResources: vi.fn()
}));
vi.mock('../src/core/tools', () => ({
  registerTools: vi.fn()
}));
vi.mock('../src/core/prompts', () => ({
  registerPrompts: vi.fn()
}));

import { registerResources } from '../src/core/resources';
import { registerTools } from '../src/core/tools';
import { registerPrompts } from '../src/core/prompts';

describe('Server Integration', () => {
  let mockServer: any;

  beforeEach(() => {
    // Create a mock FastMCP instance
    mockServer = {
      start: vi.fn(),
      addTool: vi.fn(),
      addResource: vi.fn(),
      addPrompt: vi.fn(),
    } as any;

    // Mock the FastMCP constructor to return our mock instance
    (FastMCP as any).mockImplementation(() => mockServer);

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('should create a server with correct configuration', async () => {
    await startServer();

    expect(FastMCP).toHaveBeenCalledWith({
      name: "MCP Server",
      version: "1.0.0"
    });
  });

  it('should register all components', async () => {
    await startServer();

    expect(registerResources).toHaveBeenCalledWith(mockServer);
    expect(registerTools).toHaveBeenCalledWith(mockServer);
    expect(registerPrompts).toHaveBeenCalledWith(mockServer);
  });

  it('should return the server instance', async () => {
    const server = await startServer();

    expect(server).toBe(mockServer);
  });

  it('should call registration functions in correct order', async () => {
    const callOrder: string[] = [];

    (registerResources as any).mockImplementation(() => {
      callOrder.push('resources');
    });
    (registerTools as any).mockImplementation(() => {
      callOrder.push('tools');
    });
    (registerPrompts as any).mockImplementation(() => {
      callOrder.push('prompts');
    });

    await startServer();

    expect(callOrder).toEqual(['resources', 'tools', 'prompts']);
  });
});