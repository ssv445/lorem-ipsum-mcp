import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { registerTools } from '../src/core/tools';
import * as services from '../src/core/services/index';

// Mock the FastMCP class
vi.mock('fastmcp');
vi.mock('../src/core/services/index');

describe('Tools Registration', () => {
  let mockServer: any;
  let mockAddTool: any;

  beforeEach(() => {
    mockAddTool = vi.fn();
    mockServer = {
      addTool: mockAddTool,
    } as any;

    // Reset mocks
    vi.clearAllMocks();
  });

  it('should register all tools with the server', () => {
    registerTools(mockServer);

    expect(mockAddTool).toHaveBeenCalledTimes(4);
  });

  it('should register hello tool correctly', () => {
    registerTools(mockServer);

    const helloToolCall = mockAddTool.mock.calls.find(
      call => call[0].name === 'hello'
    );

    expect(helloToolCall).toBeDefined();
    expect(helloToolCall[0]).toMatchObject({
      name: 'hello',
      description: "Replies with 'world'",
      parameters: expect.any(Object),
      execute: expect.any(Function)
    });
  });

  it('should register hello_world tool correctly', () => {
    registerTools(mockServer);

    const helloWorldToolCall = mockAddTool.mock.calls.find(
      call => call[0].name === 'hello_world'
    );

    expect(helloWorldToolCall).toBeDefined();
    expect(helloWorldToolCall[0]).toMatchObject({
      name: 'hello_world',
      description: 'A simple hello world tool',
      parameters: expect.any(Object),
      execute: expect.any(Function)
    });
  });

  it('should register goodbye tool correctly', () => {
    registerTools(mockServer);

    const goodbyeToolCall = mockAddTool.mock.calls.find(
      call => call[0].name === 'goodbye'
    );

    expect(goodbyeToolCall).toBeDefined();
    expect(goodbyeToolCall[0]).toMatchObject({
      name: 'goodbye',
      description: 'A simple goodbye tool',
      parameters: expect.any(Object),
      execute: expect.any(Function)
    });
  });

  it('should register image tool correctly', () => {
    registerTools(mockServer);

    const imageToolCall = mockAddTool.mock.calls.find(
      call => call[0].name === 'image'
    );

    expect(imageToolCall).toBeDefined();
    expect(imageToolCall[0]).toMatchObject({
      name: 'image',
      description: 'Generate or fetch images from picsum.photos with various options',
      parameters: expect.any(Object),
      execute: expect.any(Function)
    });
  });
});

describe('Tool Execution', () => {
  let mockServer: any;
  let helloTool: any;
  let helloWorldTool: any;
  let goodbyeTool: any;
  let imageTool: any;

  beforeEach(() => {
    const mockAddTool = vi.fn((tool) => {
      if (tool.name === 'hello') helloTool = tool;
      else if (tool.name === 'hello_world') helloWorldTool = tool;
      else if (tool.name === 'goodbye') goodbyeTool = tool;
      else if (tool.name === 'image') imageTool = tool;
    });

    mockServer = {
      addTool: mockAddTool,
    } as any;

    // Mock the GreetingService
    (services.GreetingService.generateGreeting as any) = vi.fn()
      .mockReturnValue('Mocked greeting');
    (services.GreetingService.generateFarewell as any) = vi.fn()
      .mockReturnValue('Mocked farewell');

    // Mock the ImageService
    (services.ImageService.generateImage as any) = vi.fn()
      .mockResolvedValue('Mocked image result');

    registerTools(mockServer);
  });

  describe('hello tool', () => {
    it('should return "world" when executed', async () => {
      const result = await helloTool.execute({});
      expect(result).toBe('world');
    });

    it('should accept empty parameters', () => {
      const params = {};
      const validation = helloTool.parameters.safeParse(params);
      expect(validation.success).toBe(true);
    });
  });

  describe('hello_world tool', () => {
    it('should call GreetingService.generateGreeting with correct name', async () => {
      const params = { name: 'Alice' };
      
      await helloWorldTool.execute(params);
      
      expect(services.GreetingService.generateGreeting).toHaveBeenCalledWith('Alice');
    });

    it('should return the greeting from GreetingService', async () => {
      const params = { name: 'Bob' };
      
      const result = await helloWorldTool.execute(params);
      
      expect(result).toBe('Mocked greeting');
    });

    it('should validate parameters correctly', () => {
      const validParams = { name: 'Alice' };
      const invalidParams = {};

      const validValidation = helloWorldTool.parameters.safeParse(validParams);
      const invalidValidation = helloWorldTool.parameters.safeParse(invalidParams);

      expect(validValidation.success).toBe(true);
      expect(invalidValidation.success).toBe(false);
    });
  });

  describe('goodbye tool', () => {
    it('should call GreetingService.generateFarewell with correct name', async () => {
      const params = { name: 'Charlie' };
      
      await goodbyeTool.execute(params);
      
      expect(services.GreetingService.generateFarewell).toHaveBeenCalledWith('Charlie');
    });

    it('should return the farewell from GreetingService', async () => {
      const params = { name: 'Diana' };
      
      const result = await goodbyeTool.execute(params);
      
      expect(result).toBe('Mocked farewell');
    });

    it('should validate parameters correctly', () => {
      const validParams = { name: 'Eve' };
      const invalidParams = {};

      const validValidation = goodbyeTool.parameters.safeParse(validParams);
      const invalidValidation = goodbyeTool.parameters.safeParse(invalidParams);

      expect(validValidation.success).toBe(true);
      expect(invalidValidation.success).toBe(false);
    });
  });

  describe('image tool', () => {
    it('should call ImageService.generateImage with correct parameters', async () => {
      const params = { width: 200, height: 300, output: 'url' as const };
      
      await imageTool.execute(params);
      
      expect(services.ImageService.generateImage).toHaveBeenCalledWith(params);
    });

    it('should return the result from ImageService', async () => {
      const params = { width: 200, height: 300 };
      
      const result = await imageTool.execute(params);
      
      expect(result).toBe('Mocked image result');
    });

    it('should validate parameters correctly', () => {
      const validParams = { width: 200, height: 300 };
      const validParamsWithOptional = { 
        width: 200, 
        height: 300, 
        id: 'test', 
        seed: 'test-seed',
        grayscale: true,
        blur: 5,
        format: 'jpg' as const,
        output: 'file' as const,
        list: false,
        page: 1,
        limit: 10,
        info: false
      };
      const invalidBlurParams = { width: 200, height: 300, blur: 15 };
      const invalidFormatParams = { width: 200, height: 300, format: 'png' };

      const validValidation = imageTool.parameters.safeParse(validParams);
      const validValidationWithOptional = imageTool.parameters.safeParse(validParamsWithOptional);
      const invalidBlurValidation = imageTool.parameters.safeParse(invalidBlurParams);
      const invalidFormatValidation = imageTool.parameters.safeParse(invalidFormatParams);

      expect(validValidation.success).toBe(true);
      expect(validValidationWithOptional.success).toBe(true);
      expect(invalidBlurValidation.success).toBe(false);
      expect(invalidFormatValidation.success).toBe(false);
    });

    it('should have proper default for output parameter', () => {
      const params = { width: 200 };
      const validation = imageTool.parameters.safeParse(params);
      
      expect(validation.success).toBe(true);
      expect(validation.data.output).toBe('url');
    });
  });
});