/**
 * Integration Tests for Agent Workflow
 * 
 * Tests the complete agent workflow and routing functionality
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

describe('Agent Workflow Integration', () => {
  const opencodeDir = path.join(__dirname, '../../.opencode');

  describe('System Status', () => {
    test('status.js should execute successfully', () => {
      const statusPath = path.join(opencodeDir, 'status.js');
      expect(fs.existsSync(statusPath)).toBe(true);
      
      const result = execSync(
        `node ${statusPath} --quiet`,
        { encoding: 'utf-8', timeout: 15000 }
      );
      
      expect(result).toBeDefined();
    });

    test('status.js should output JSON format', () => {
      const statusPath = path.join(opencodeDir, 'status.js');
      
      const result = execSync(
        `node ${statusPath} --json`,
        { encoding: 'utf-8', timeout: 15000 }
      );
      
      const json = JSON.parse(result);
      expect(json).toBeDefined();
      expect(json).toHaveProperty('status');
      expect(json.status).toHaveProperty('agents');
      expect(json.status).toHaveProperty('models');
      expect(json.status).toHaveProperty('skills');
    });
  });

  describe('Skill Matcher Integration', () => {
    test('should match various task types correctly', () => {
      const skillMatcherPath = path.join(opencodeDir, 'skill-matcher.js');
      
      const testCases = [
        { task: '开发 Python Web 应用', expectedSkill: 'python' },
        { task: '写一个爱情故事', expectedSkill: 'fiction' },
        { task: 'PCB 设计', expectedSkill: 'pcb' },
        { task: '市场调研分析', expectedSkill: 'market' }
      ];
      
      testCases.forEach(({ task, expectedSkill }) => {
        // Use execSync with stdio: 'pipe' to capture output even on non-zero exit
        let result;
        try {
          result = execSync(
            `node ${skillMatcherPath} "${task}"`,
            { encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] }
          );
        } catch (error) {
          // Skill matcher exits with code 2 for low confidence - this is expected
          result = error.stdout || error.stderr;
        }
        
        expect(result).toBeDefined();
        expect(result.toLowerCase()).toContain(expectedSkill);
      });
    });
  });

  describe('Configuration Files', () => {
    test('all required config files should exist', () => {
      const requiredFiles = [
        'models.json',
        'skills.json',
        'commands.json'
      ];
      
      requiredFiles.forEach(file => {
        const filePath = path.join(opencodeDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        
        // Verify valid JSON
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
      });
    });
  });

  describe('Agent Definitions', () => {
    test('all agent definition files should exist', () => {
      const agentsDir = path.join(opencodeDir, 'agents');
      expect(fs.existsSync(agentsDir)).toBe(true);
      
      const requiredAgents = [
        'agentgv-router.md',
        'agentgv-planning.md',
        'agentgv-operations.md',
        'agentgv-quality.md',
        'agentgv-administration.md'
      ];
      
      requiredAgents.forEach(agent => {
        const agentPath = path.join(agentsDir, agent);
        expect(fs.existsSync(agentPath)).toBe(true);
      });
    });
  });

  describe('Skills Directory', () => {
    test('skill templates should exist for all skills', () => {
      const skillsDir = path.join(opencodeDir, 'skills');
      expect(fs.existsSync(skillsDir)).toBe(true);
      
      // Get actual categories from the directory
      const categories = fs.readdirSync(skillsDir).filter(item => {
        const itemPath = path.join(skillsDir, item);
        return fs.statSync(itemPath).isDirectory();
      });
      
      expect(categories.length).toBeGreaterThan(0);
      
      // Check that each skill in each category has a SKILL.md file
      let totalSkills = 0;
      categories.forEach(category => {
        const categoryDir = path.join(skillsDir, category);
        const skills = fs.readdirSync(categoryDir).filter(item => {
          const itemPath = path.join(categoryDir, item);
          return fs.statSync(itemPath).isDirectory();
        });
        
        skills.forEach(skill => {
          const skillFile = path.join(categoryDir, skill, 'SKILL.md');
          expect(fs.existsSync(skillFile)).toBe(true);
          totalSkills++;
        });
      });
      
      expect(totalSkills).toBeGreaterThan(0);
    });
  });

  describe('Auto Sync Model', () => {
    test('auto-sync-model.js should exist and be executable', () => {
      const syncPath = path.join(opencodeDir, 'auto-sync-model.js');
      expect(fs.existsSync(syncPath)).toBe(true);
      
      // Check file is readable
      const content = fs.readFileSync(syncPath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#!/usr/bin/env node');
    });
  });
});
