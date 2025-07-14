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

    expect(mockAddTool).toHaveBeenCalledTimes(1);
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
  let imageTool: any;

  beforeEach(() => {
    const mockAddTool = vi.fn((tool) => {
      if (tool.name === 'image') imageTool = tool;
    });

    mockServer = {
      addTool: mockAddTool,
    } as any;

    // Mock the ImageService
    (services.ImageService.generateImage as any) = vi.fn()
      .mockResolvedValue('Mocked image result');

    registerTools(mockServer);
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