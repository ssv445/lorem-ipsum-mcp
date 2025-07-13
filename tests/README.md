# Testing Documentation

This document describes the comprehensive test suite for the MCP (Model Context Protocol) server.

## Test Framework

The project uses [Vitest](https://vitest.dev/) as the testing framework, which provides:
- Native TypeScript support
- ESM module support
- Fast execution
- Built-in coverage reporting
- Jest-compatible API

## Test Structure

### Unit Tests

#### Tools Tests (`tests/tools.test.ts`)
Tests the MCP tool registration and execution:
- Tool registration validation
- Parameter validation using Zod schemas
- Tool execution with mocked dependencies
- Service integration testing

#### Image Service Tests (`tests/image-service.test.ts`)
Tests the core image generation functionality:
- Image URL generation with various parameters
- Parameter validation and edge cases
- Error handling and service reliability

#### Server Integration Tests (`tests/server.test.ts`)
Tests the server initialization and component registration:
- Server configuration validation
- Component registration order
- Dependency injection testing

### Integration Tests (`tests/integration.test.ts`)
End-to-End workflow testing:
- Tool parameter validation
- Concurrent operation testing
- Service reliability validation

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI (browser-based interface)
npm run test:ui
```

### Test Coverage

Current test coverage includes:
- **Tools**: 100% coverage of all tool implementations
- **Services**: 100% coverage of ImageService
- **Server**: 86% coverage of server initialization
- **Overall**: ~85% coverage (focused on active components)

### Test Categories

1. **Unit Tests**: Test individual functions and classes in isolation
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete workflows
4. **Edge Case Tests**: Test boundary conditions and error scenarios

## Test Files Overview

### `tools.test.ts`
- ✅ 6 tests covering tool registration and execution
- ✅ Tests parameter validation with Zod schemas
- ✅ Mocks FastMCP server and service dependencies
- ✅ Validates tool configuration and behavior

### `image-service.test.ts`
- ✅ 21 tests covering image generation functionality
- ✅ Tests various parameter combinations and edge cases
- ✅ Validates URL generation and error handling
- ✅ Tests service reliability and consistency

### `server.test.ts`
- ✅ 4 tests covering server initialization
- ✅ Tests component registration order
- ✅ Validates server configuration
- ✅ Mocks external dependencies

### `integration.test.ts`
- ✅ 2 tests covering end-to-end workflows
- ✅ Tests parameter validation across the stack
- ✅ Validates service reliability and consistency
- ✅ Tests concurrent operations

## Test Best Practices

### Mocking Strategy
- **FastMCP**: Mocked to avoid external dependencies
- **Services**: Mocked in tool tests to isolate functionality
- **Real Services**: Used in integration tests for realistic scenarios

### Test Data
- Uses realistic image parameters and scenarios
- Tests edge cases systematically
- Includes Unicode and special character handling

### Assertions
- Validates exact matches where appropriate
- Uses partial matching for flexible validation
- Tests both positive and negative scenarios

## Continuous Integration

The test suite is designed for CI/CD environments:
- All tests run in under 2 seconds
- No external dependencies required
- Comprehensive coverage reporting
- Compatible with GitHub Actions and other CI systems

## Coverage Goals

- **Functions**: >90% coverage
- **Statements**: >80% coverage
- **Branches**: >80% coverage
- **Lines**: >80% coverage

Current coverage meets or exceeds these goals for all actively used components.

## Adding New Tests

When adding new functionality:

1. **Unit Tests**: Create tests for new functions/classes
2. **Integration Tests**: Add workflow tests for new features
3. **Update Mocks**: Ensure mocks reflect new interfaces
4. **Coverage**: Maintain coverage above threshold

### Example Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('NewFeature', () => {
  it('should handle basic functionality', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = newFunction(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

## Debugging Tests

### Running Specific Tests
```bash
# Run specific test file
npx vitest image-service.test.ts

# Run tests matching pattern
npx vitest --grep "image tool"
```

### Debug Mode
```bash
# Run with verbose output
npx vitest --reporter=verbose

# Run with browser UI for debugging
npm run test:ui
```

## Dependencies

Testing dependencies include:
- `vitest`: Core testing framework
- `@vitest/ui`: Browser-based test interface
- `@vitest/coverage-v8`: Coverage reporting

All testing dependencies are isolated to `devDependencies` and don't affect production builds.