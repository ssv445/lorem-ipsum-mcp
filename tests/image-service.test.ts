import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImageService } from '../src/core/services/image-service';

// Mock fetch for testing
global.fetch = vi.fn();

// Mock the imageContent function
vi.mock('fastmcp', () => ({
  imageContent: vi.fn().mockImplementation(({ url }) => Promise.resolve({
    type: 'image',
    data: 'mocked-base64-data',
    mimeType: 'image/jpeg'
  }))
}));

describe('ImageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('URL generation', () => {
    it('should generate URL for random image with width and height', async () => {
      const result = await ImageService.generateImage({
        width: 200,
        height: 300,
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/200/300');
    });

    it('should generate URL for square image with only width', async () => {
      const result = await ImageService.generateImage({
        width: 200,
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/200');
    });

    it('should generate URL for specific image by ID', async () => {
      const result = await ImageService.generateImage({
        id: '870',
        width: 200,
        height: 300,
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/id/870/200/300');
    });

    it('should generate URL with seed parameter', async () => {
      const result = await ImageService.generateImage({
        width: 200,
        height: 300,
        seed: 'test-seed',
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/200/300?seed=test-seed');
    });

    it('should generate URL with grayscale filter', async () => {
      const result = await ImageService.generateImage({
        width: 200,
        height: 300,
        grayscale: true,
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/200/300?grayscale');
    });

    it('should generate URL with blur filter', async () => {
      const result = await ImageService.generateImage({
        width: 200,
        height: 300,
        blur: 5,
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/200/300?blur=5');
    });

    it('should generate URL with format parameter', async () => {
      const result = await ImageService.generateImage({
        width: 200,
        height: 300,
        format: 'webp',
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/200/300?fmt=webp');
    });

    it('should generate URL with multiple parameters', async () => {
      const result = await ImageService.generateImage({
        id: '870',
        width: 200,
        height: 300,
        seed: 'test-seed',
        grayscale: true,
        blur: 2,
        format: 'webp',
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/id/870/200/300?seed=test-seed&grayscale&blur=2&fmt=webp');
    });

    it('should use default size when no dimensions specified', async () => {
      const result = await ImageService.generateImage({
        output: 'url'
      });

      expect(result).toBe('https://picsum.photos/200');
    });
  });

  describe('File output', () => {
    it('should return ImageContent when output is file', async () => {
      const { imageContent } = await import('fastmcp');
      
      const result = await ImageService.generateImage({
        width: 200,
        height: 300,
        output: 'file'
      });

      expect(imageContent).toHaveBeenCalledWith({
        url: 'https://picsum.photos/200/300'
      });
      expect(result).toEqual({
        type: 'image',
        data: 'mocked-base64-data',
        mimeType: 'image/jpeg'
      });
    });
  });

  describe('List functionality', () => {
    it('should fetch image list without parameters', async () => {
      const mockResponse = [
        { id: '1', author: 'Test Author', width: 200, height: 300 }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await ImageService.generateImage({
        list: true
      });

      expect(global.fetch).toHaveBeenCalledWith('https://picsum.photos/v2/list');
      expect(result).toEqual({
        type: 'text',
        text: JSON.stringify(mockResponse, null, 2)
      });
    });

    it('should fetch image list with page and limit', async () => {
      const mockResponse = [
        { id: '1', author: 'Test Author', width: 200, height: 300 }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await ImageService.generateImage({
        list: true,
        page: 2,
        limit: 50
      });

      expect(global.fetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?page=2&limit=50');
      expect(result).toEqual({
        type: 'text',
        text: JSON.stringify(mockResponse, null, 2)
      });
    });

    it('should handle fetch error for list', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(ImageService.generateImage({ list: true }))
        .rejects.toThrow('Error fetching image list: Failed to fetch image list: 404 Not Found');
    });
  });

  describe('Info functionality', () => {
    it('should fetch image info by ID', async () => {
      const mockResponse = {
        id: '870',
        author: 'Test Author',
        width: 200,
        height: 300,
        url: 'https://picsum.photos/id/870/info'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await ImageService.generateImage({
        info: true,
        id: '870'
      });

      expect(global.fetch).toHaveBeenCalledWith('https://picsum.photos/v2/images/870');
      expect(result).toEqual({
        type: 'text',
        text: JSON.stringify(mockResponse, null, 2)
      });
    });

    it('should return seed info when seed is provided', async () => {
      const result = await ImageService.generateImage({
        info: true,
        seed: 'test-seed',
        width: 200,
        height: 300
      });

      const expectedInfo = {
        seed: 'test-seed',
        url: 'https://picsum.photos/200/300?seed=test-seed',
        width: 200,
        height: 300,
        message: 'This is info for a seed-based image. Seed-based images use deterministic generation.'
      };

      expect(result).toEqual({
        type: 'text',
        text: JSON.stringify(expectedInfo, null, 2)
      });
    });

    it('should throw error when info is requested without id or seed', async () => {
      await expect(ImageService.generateImage({ info: true }))
        .rejects.toThrow('Info operation requires either --id or --seed parameter');
    });

    it('should handle fetch error for info', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(ImageService.generateImage({ info: true, id: 'nonexistent' }))
        .rejects.toThrow('Error fetching image info: Failed to fetch image info: 404 Not Found');
    });
  });

  describe('Parameter validation', () => {
    it('should throw error for blur value less than 1', async () => {
      await expect(ImageService.generateImage({
        width: 200,
        height: 300,
        blur: 0
      })).rejects.toThrow('Blur value must be between 1 and 10');
    });

    it('should throw error for blur value greater than 10', async () => {
      await expect(ImageService.generateImage({
        width: 200,
        height: 300,
        blur: 11
      })).rejects.toThrow('Blur value must be between 1 and 10');
    });

    it('should accept valid blur values', async () => {
      const result1 = await ImageService.generateImage({
        width: 200,
        height: 300,
        blur: 1,
        output: 'url'
      });

      const result10 = await ImageService.generateImage({
        width: 200,
        height: 300,
        blur: 10,
        output: 'url'
      });

      expect(result1).toBe('https://picsum.photos/200/300?blur=1');
      expect(result10).toBe('https://picsum.photos/200/300?blur=10');
    });
  });

  describe('Default behavior', () => {
    it('should default to url output when not specified', async () => {
      const result = await ImageService.generateImage({
        width: 200,
        height: 300
      });

      expect(result).toBe('https://picsum.photos/200/300');
    });
  });
});