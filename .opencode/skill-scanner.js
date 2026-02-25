#!/usr/bin/env node

/**
 * Skill Scanner
 *
 * Scans the skills/ directory for available skills and generates
 * an index for the skill-matcher to use.
 *
 * Usage: node skill-scanner.js [--index]
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, 'skills');
const INDEX_FILE = path.join(__dirname, 'skills-index.json');

/**
 * Parse YAML frontmatter from markdown
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return null;
  }

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim());
      }

      frontmatter[key] = value;
    }
  }

  return {
    frontmatter,
    content: match[2]
  };
}

/**
 * Recursively scan directory for SKILL.md files
 */
function scanSkills(dir, basePath = '') {
  const skills = [];

  if (!fs.existsSync(dir)) {
    return skills;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      const subDir = path.join(dir, entry.name);
      const subPath = basePath ? `${basePath}/${entry.name}` : entry.name;
      skills.push(...scanSkills(subDir, subPath));
    } else if (entry.name === 'SKILL.md') {
      const filePath = path.join(dir, entry.name);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseFrontmatter(content);

      if (parsed) {
        skills.push({
          id: parsed.frontmatter.name || basePath.replace(/\//g, '-'),
          path: basePath,
          file: filePath,
          ...parsed.frontmatter,
          content: parsed.content
        });
      }
    }
  }

  return skills;
}

/**
 * Generate skills index
 */
function generateIndex() {
  console.log('🔍 Scanning skills directory...');

  const skills = scanSkills(SKILLS_DIR);

  console.log(`✅ Found ${skills.length} skills`);

  const index = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    total: skills.length,
    categories: {},
    skills: skills.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category,
      keywords: s.keywords,
      model: s.model,
      temperature: s.temperature,
      path: s.path
    }))
  };

  // Group by category
  for (const skill of skills) {
    const category = skill.category || 'other';
    if (!index.categories[category]) {
      index.categories[category] = [];
    }
    index.categories[category].push(skill.id);
  }

  // Save index
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`📄 Index saved to: ${INDEX_FILE}`);

  // Print summary
  console.log('\n📊 Skill Summary:');
  for (const [category, skillIds] of Object.entries(index.categories)) {
    console.log(`   ${category}: ${skillIds.length} skills`);
  }

  return index;
}

/**
 * Load skills index
 */
function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    return generateIndex();
  }
  return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--index') || args.includes('-i')) {
    generateIndex();
  } else {
    const index = loadIndex();
    console.log(JSON.stringify(index, null, 2));
  }
}

module.exports = { scanSkills, generateIndex, loadIndex, parseFrontmatter };
