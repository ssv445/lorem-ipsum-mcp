import { describe, it, expect } from 'vitest';
import { GreetingService } from '../src/core/services/greeting-service';

describe('GreetingService', () => {
  describe('generateGreeting', () => {
    it('should generate a proper greeting message', () => {
      const name = 'Alice';
      const result = GreetingService.generateGreeting(name);
      
      expect(result).toBe('Hello, Alice! Welcome to the MCP Server.');
    });

    it('should handle empty string name', () => {
      const name = '';
      const result = GreetingService.generateGreeting(name);
      
      expect(result).toBe('Hello, ! Welcome to the MCP Server.');
    });

    it('should handle special characters in name', () => {
      const name = 'João & María';
      const result = GreetingService.generateGreeting(name);
      
      expect(result).toBe('Hello, João & María! Welcome to the MCP Server.');
    });

    it('should handle long names', () => {
      const name = 'VeryLongNameThatShouldStillWork';
      const result = GreetingService.generateGreeting(name);
      
      expect(result).toBe('Hello, VeryLongNameThatShouldStillWork! Welcome to the MCP Server.');
    });
  });

  describe('generateFarewell', () => {
    it('should generate a proper farewell message', () => {
      const name = 'Bob';
      const result = GreetingService.generateFarewell(name);
      
      expect(result).toBe('Goodbye, Bob! Thank you for using the MCP Server.');
    });

    it('should handle empty string name', () => {
      const name = '';
      const result = GreetingService.generateFarewell(name);
      
      expect(result).toBe('Goodbye, ! Thank you for using the MCP Server.');
    });

    it('should handle special characters in name', () => {
      const name = 'Dr. Smith-Jones';
      const result = GreetingService.generateFarewell(name);
      
      expect(result).toBe('Goodbye, Dr. Smith-Jones! Thank you for using the MCP Server.');
    });

    it('should handle numeric names', () => {
      const name = '123';
      const result = GreetingService.generateFarewell(name);
      
      expect(result).toBe('Goodbye, 123! Thank you for using the MCP Server.');
    });
  });
});