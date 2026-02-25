/**
 * Unit Tests for Config Validator
 * 
 * Tests the config-validator.js module functionality
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

describe('Config Validator', () => {
  const validatorPath = path.join(__dirname, '../../.opencode/scripts/validators/config-validator.js');

  describe('Configuration Validation', () => {
    test('should validate models.json successfully', () => {
      const modelsPath = path.join(__dirname, '../../.opencode/models.json');
      expect(fs.existsSync(modelsPath)).toBe(true);
      
      const content = fs.readFileSync(modelsPath, 'utf-8');
      const models = JSON.parse(content);
      
      expect(models).toHaveProperty('models');
      expect(Array.isArray(models.models)).toBe(true);
      expect(models.models.length).toBeGreaterThan(0);
    });

    test('should validate skills.json successfully', () => {
      const skillsPath = path.join(__dirname, '../../.opencode/skills.json');
      expect(fs.existsSync(skillsPath)).toBe(true);
      
      const content = fs.readFileSync(skillsPath, 'utf-8');
      const skills = JSON.parse(content);
      
      expect(skills).toHaveProperty('skill_categories');
      expect(Object.keys(skills.skill_categories).length).toBeGreaterThan(0);
    });

    test('should validate commands.json successfully', () => {
      const commandsPath = path.join(__dirname, '../../.opencode/commands.json');
      expect(fs.existsSync(commandsPath)).toBe(true);
      
      const content = fs.readFileSync(commandsPath, 'utf-8');
      const commands = JSON.parse(content);
      
      expect(commands).toHaveProperty('commands');
    });
  });

  describe('Validator Execution', () => {
    test('should run validator without errors', () => {
      const result = execSync(
        `node ${validatorPath}`,
        { encoding: 'utf-8', timeout: 10000 }
      );
      
      expect(result).toBeDefined();
      expect(result.toLowerCase()).toMatch(/(valid|success|passed)/i);
    });
  });

  describe('Schema Validation', () => {
    test('models.json should have required fields', () => {
      const modelsPath = path.join(__dirname, '../../.opencode/models.json');
      const models = JSON.parse(fs.readFileSync(modelsPath, 'utf-8'));
      
      models.models.forEach(model => {
        expect(model).toHaveProperty('id');
        expect(model).toHaveProperty('name');
        // Check for either 'cost' or 'cost_level' field
        expect(model.cost || model.cost_level).toBeDefined();
      });
    });

    test('skills.json should have valid categories', () => {
      const skillsPath = path.join(__dirname, '../../.opencode/skills.json');
      const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));
      
      const validCategories = ['software', 'hardware', 'simulation', 'creative', 'research'];
      Object.keys(skills.skill_categories).forEach(category => {
        expect(validCategories).toContain(category);
        
        const categoryData = skills.skill_categories[category];
        expect(categoryData).toHaveProperty('skills');
        expect(Array.isArray(categoryData.skills)).toBe(true);
        
        categoryData.skills.forEach(skill => {
          expect(skill).toHaveProperty('id');
          expect(skill).toHaveProperty('name');
          expect(skill).toHaveProperty('keywords');
        });
      });
    });
  });
});
