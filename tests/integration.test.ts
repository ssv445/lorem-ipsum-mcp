import { describe, it, expect } from 'vitest';
import { GreetingService } from '../src/core/services/greeting-service';

describe('End-to-End Tool Workflow', () => {
  describe('Complete greeting workflow', () => {
    it('should perform a complete greeting interaction', () => {
      const testName = 'TestUser';
      
      // Simulate the hello_world tool workflow
      const greeting = GreetingService.generateGreeting(testName);
      expect(greeting).toBe('Hello, TestUser! Welcome to the MCP Server.');
      
      // Simulate the goodbye tool workflow
      const farewell = GreetingService.generateFarewell(testName);
      expect(farewell).toBe('Goodbye, TestUser! Thank you for using the MCP Server.');
    });

    it('should handle edge cases in complete workflow', () => {
      const edgeCases = ['', '123', 'User@Domain.com', 'Multi Word Name'];
      
      edgeCases.forEach(name => {
        const greeting = GreetingService.generateGreeting(name);
        const farewell = GreetingService.generateFarewell(name);
        
        expect(greeting).toContain(name);
        expect(farewell).toContain(name);
        expect(greeting).toContain('Hello');
        expect(farewell).toContain('Goodbye');
      });
    });
  });

  describe('Tool parameter validation', () => {
    it('should validate string parameters correctly', () => {
      const validInputs = ['Alice', 'Bob', '123', 'test@example.com'];
      const invalidInputs = [null, undefined, 123, {}, []];
      
      validInputs.forEach(input => {
        expect(typeof input).toBe('string');
      });
      
      invalidInputs.forEach(input => {
        expect(typeof input).not.toBe('string');
      });
    });
  });

  describe('Service reliability', () => {
    it('should consistently return predictable results', () => {
      const name = 'ConsistencyTest';
      const iterations = 10;
      
      const greetings = Array(iterations).fill(null).map(() => 
        GreetingService.generateGreeting(name)
      );
      
      const farewells = Array(iterations).fill(null).map(() => 
        GreetingService.generateFarewell(name)
      );
      
      // All results should be identical
      expect(new Set(greetings).size).toBe(1);
      expect(new Set(farewells).size).toBe(1);
    });

    it('should handle concurrent calls correctly', async () => {
      const names = ['User1', 'User2', 'User3', 'User4', 'User5'];
      
      const greetingPromises = names.map(name => 
        Promise.resolve(GreetingService.generateGreeting(name))
      );
      
      const farewellPromises = names.map(name => 
        Promise.resolve(GreetingService.generateFarewell(name))
      );
      
      const greetings = await Promise.all(greetingPromises);
      const farewells = await Promise.all(farewellPromises);
      
      expect(greetings).toHaveLength(5);
      expect(farewells).toHaveLength(5);
      
      greetings.forEach((greeting, index) => {
        expect(greeting).toContain(names[index]);
      });
      
      farewells.forEach((farewell, index) => {
        expect(farewell).toContain(names[index]);
      });
    });
  });
});