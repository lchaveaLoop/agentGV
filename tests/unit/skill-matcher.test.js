/**
 * Unit Tests for Skill Matcher
 * 
 * Tests the skill-matcher.js module functionality
 */

const path = require('path');
const { execSync } = require('child_process');

describe('Skill Matcher', () => {
  const skillMatcherPath = path.join(__dirname, '../../.opencode/skill-matcher.js');

  describe('Command Line Interface', () => {
    test('should return help message when no arguments provided', () => {
      expect(() => {
        execSync(`node ${skillMatcherPath}`, { 
          stdio: 'pipe',
          timeout: 5000
        });
      }).toThrow();
    });

    test('should match software development tasks', () => {
      const result = execSync(
        `node ${skillMatcherPath} "用 Python 开发一个 Web 应用"`,
        { encoding: 'utf-8', timeout: 5000 }
      );
      
      expect(result).toBeDefined();
      expect(result.toLowerCase()).toContain('skill');
    });

    test('should match creative writing tasks', () => {
      const result = execSync(
        `node ${skillMatcherPath} "写一篇科幻小说"`,
        { encoding: 'utf-8', timeout: 5000 }
      );
      
      expect(result).toBeDefined();
      expect(result.toLowerCase()).toContain('fiction');
    });

    test('should match hardware tasks', () => {
      const result = execSync(
        `node ${skillMatcherPath} "设计一个 PCB 电路板"`,
        { encoding: 'utf-8', timeout: 5000 }
      );
      
      expect(result).toBeDefined();
      expect(result.toLowerCase()).toContain('pcb');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid input gracefully', () => {
      expect(() => {
        execSync(
          `node ${skillMatcherPath} ""`,
          { encoding: 'utf-8', timeout: 5000 }
        );
      }).toThrow();
    });
  });
});
