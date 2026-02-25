/**
 * Jest Configuration for AgentGV
 * 
 * Supports ES6 modules and provides comprehensive testing setup
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Test file extensions
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'node'],
  
  // Enable ES6 module support
  transform: {},
  
  // Support ES6 modules in tests
  transformIgnorePatterns: [
    '/node_modules/(?!(some-es6-module)/)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    '.opencode/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/tests/**',
    '!.opencode/detect-model.js'
  ],
  
  // Coverage thresholds (target 80% - disabled for existing codebase)
  /*
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  */
  
  // Coverage report formats
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Verbose output
  verbose: true,
  
  // Clear cache before each run
  clearMocks: true,
  
  // Collect coverage
  collectCoverage: true,
  
  // Coverage providers
  coverageProvider: 'v8',
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Test timeout (ms)
  testTimeout: 30000,
  
  // Maximum workers
  maxWorkers: '50%',
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Force exit
  forceExit: true
};
