#!/usr/bin/env node

/**
 * Skill Matcher
 */

const fs = require('fs');
const path = require('path');

const SKILLS_CONFIG = path.join(__dirname, 'skills.json');

function loadSkills() {
  return JSON.parse(fs.readFileSync(SKILLS_CONFIG, 'utf-8'));
}

function matchSkill(taskDescription, skills) {
  const taskLower = taskDescription.toLowerCase();
  const matches = [];
  
  for (const [category, data] of Object.entries(skills.skill_categories)) {
    for (const skill of data.skills) {
      const score = skill.keywords.reduce((acc, keyword) => {
        if (taskLower.includes(keyword.toLowerCase())) {
          return acc + 1;
        }
        return acc;
      }, 0);
      
      if (score > 0) {
        matches.push({
          skill,
          category,
          score,
          matchedKeywords: skill.keywords.filter(k => 
            taskLower.includes(k.toLowerCase())
          )
        });
      }
    }
  }
  
  matches.sort((a, b) => b.score - a.score);
  return matches;
}

function getBestSkill(taskDescription) {
  const skills = loadSkills();
  const matches = matchSkill(taskDescription, skills);
  
  if (matches.length === 0) {
    return {
      skill: {
        id: 'general',
        name: 'General Purpose',
        model: 'bailian-coding-plan/qwen3.5-plus',
        temperature: 0.3,
        system_prompt: 'You are a general-purpose AI assistant.'
      },
      category: 'general',
      confidence: 'low',
      matchedKeywords: []
    };
  }
  
  const best = matches[0];
  const confidence = best.score >= 3 ? 'high' : best.score === 2 ? 'medium' : 'low';
  
  return {
    skill: best.skill,
    category: best.category,
    confidence,
    matchedKeywords: best.matchedKeywords
  };
}

function getTaskType(description) {
  const desc = description.toLowerCase();
  if (desc.includes('架构') || desc.includes('设计') || desc.includes('system')) return 'architecture';
  if (desc.includes('调研') || desc.includes('研究') || desc.includes('分析')) return 'research';
  if (desc.includes('开发') || desc.includes('实现') || desc.includes('编码')) return 'coding';
  if (desc.includes('测试') || desc.includes('审查') || desc.includes('质量')) return 'review';
  if (desc.includes('文档') || desc.includes('报告') || desc.includes('写作')) return 'documentation';
  if (desc.includes('协调') || desc.includes('管理') || desc.includes('项目')) return 'coordination';
  return 'other';
}

function formatSkillInfo(skillMatch) {
  return {
    skill_id: skillMatch.skill.id,
    skill_name: skillMatch.skill.name,
    category: skillMatch.category,
    model: skillMatch.skill.model,
    temperature: skillMatch.skill.temperature,
    confidence: skillMatch.confidence,
    matched_keywords: skillMatch.matchedKeywords || [],
    timestamp: new Date().toISOString()
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  
  const task = args.join(' ');
  if (!task) {
    console.log('Usage: node skill-matcher.js <task description>');
    process.exit(1);
  }
  
  const match = getBestSkill(task);
  console.log(JSON.stringify(formatSkillInfo(match), null, 2));
}

module.exports = { loadSkills, matchSkill, getBestSkill, formatSkillInfo };
