import { imageContent, TextContent, ImageContent, ContentResult } from "fastmcp";

/**
 * Service for generating and fetching images from picsum.photos
 */
export class ImageService {
  private static readonly BASE_URL = 'https://picsum.photos';
  private static readonly API_URL = 'https://picsum.photos/v2';

  /**
   * Generate an image URL or fetch image data from picsum.photos
   */
  public static async generateImage(params: {
    width?: number;
    height?: number;
    id?: string;
    seed?: string;
    grayscale?: boolean;
    blur?: number;
    format?: 'jpg' | 'webp';
    output?: 'url' | 'file';
    list?: boolean;
    page?: number;
    limit?: number;
    info?: boolean;
  }): Promise<string | ImageContent | TextContent> {
    const {
      width,
      height,
      id,
      seed,
      grayscale,
      blur,
      format,
      output = 'url',
      list,
      page,
      limit,
      info
    } = params;

    // Handle list operation
    if (list) {
      const result = await this.fetchImageList(page, limit);
      return {
        type: "text",
        text: JSON.stringify(result, null, 2)
      } as TextContent;
    }

    // Handle info operation
    if (info) {
      let result: object;
      if (id) {
        result = await this.fetchImageInfo(id);
      } else if (seed) {
        result = await this.fetchSeedInfo(seed, width, height);
      } else {
        throw new Error('Info operation requires either --id or --seed parameter');
      }
      return {
        type: "text",
        text: JSON.stringify(result, null, 2)
      } as TextContent;
    }

    // Validate blur parameter
    if (blur !== undefined && (blur < 1 || blur > 10)) {
      throw new Error('Blur value must be between 1 and 10');
    }

    // Generate image URL
    const url = this.constructImageUrl({
      width,
      height,
      id,
      seed,
      grayscale,
      blur,
      format
    });

    // Return URL or fetch file data
    if (output === 'url') {
      return url;
    } else {
      // Use the imageContent helper to return proper ImageContent
      return await imageContent({ url });
    }
  }

  /**
   * Construct the image URL based on parameters
   */
  private static constructImageUrl(params: {
    width?: number;
    height?: number;
    id?: string;
    seed?: string;
    grayscale?: boolean;
    blur?: number;
    format?: 'jpg' | 'webp';
  }): string {
    const { width, height, id, seed, grayscale, blur, format } = params;

    let url: string;

    // Construct base URL path
    if (id) {
      if (width && height) {
        url = `${this.BASE_URL}/id/${id}/${width}/${height}`;
      } else if (width) {
        url = `${this.BASE_URL}/id/${id}/${width}`;
      } else {
        url = `${this.BASE_URL}/id/${id}`;
      }
    } else {
      if (width && height) {
        url = `${this.BASE_URL}/${width}/${height}`;
      } else if (width) {
        url = `${this.BASE_URL}/${width}`;
      } else {
        // Default size if no dimensions specified
        url = `${this.BASE_URL}/200`;
      }
    }

    // Add query parameters
    const queryParams: string[] = [];

    if (seed) {
      queryParams.push(`seed=${encodeURIComponent(seed)}`);
    }

    if (grayscale) {
      queryParams.push('grayscale');
    }

    if (blur) {
      queryParams.push(`blur=${blur}`);
    }

    if (format) {
      queryParams.push(`fmt=${format}`);
    }

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return url;
  }

  /**
   * Fetch list of available images
   */
  private static async fetchImageList(page?: number, limit?: number): Promise<object> {
    try {
      let url = `${this.API_URL}/list`;
      const queryParams: string[] = [];

      if (page !== undefined) {
        queryParams.push(`page=${page}`);
      }

      if (limit !== undefined) {
        queryParams.push(`limit=${limit}`);
      }

      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image list: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching image list: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch image info by ID
   */
  private static async fetchImageInfo(id: string): Promise<object> {
    try {
      const url = `${this.API_URL}/images/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image info: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching image info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch info for seed-based images (returns generated URL info)
   */
  private static async fetchSeedInfo(seed: string, width?: number, height?: number): Promise<object> {
    const url = this.constructImageUrl({ width, height, seed });
    return {
      seed,
      url,
      width: width || 200,
      height: height || width || 200,
      message: 'This is info for a seed-based image. Seed-based images use deterministic generation.'
    };
  }
}