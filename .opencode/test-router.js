#!/usr/bin/env node

/**
 * AgentGV Router Test Suite
 * Tests skill matching and subagent routing
 */

const { execSync } = require('child_process');
const path = require('path');

const SKILL_MATCHER = path.join(__dirname, 'skill-matcher.js');

const testCases = [
  {
    name: '文学创作 - 科幻小说',
    input: '写一篇科幻小说',
    expected: { skill_id: 'fiction', category: 'creative', department: 'Operations' }
  },
  {
    name: '文学创作 - 都市小说',
    input: '创作一部都市小说',
    expected: { skill_id: 'fiction', category: 'creative', department: 'Operations' }
  },
  {
    name: '文学创作 - 短篇故事',
    input: '写一个短篇故事',
    expected: { skill_id: 'fiction', category: 'creative', department: 'Operations' }
  },
  {
    name: '技术文档',
    input: '写一个技术文档',
    expected: { skill_id: 'technical', category: 'creative', department: 'Operations' }
  },
  {
    name: '内容创作',
    input: '写一篇博客文章',
    expected: { skill_id: 'content', category: 'creative', department: 'Operations' }
  },
  {
    name: '软件开发 - C++',
    input: '用 C++ Qt 开发一个程序',
    expected: { skill_id: 'cpp', category: 'software', department: 'Operations' }
  },
  {
    name: '软件开发 - Python',
    input: '用 Python 写一个爬虫',
    expected: { skill_id: 'python', category: 'software', department: 'Operations' }
  },
  {
    name: '市场调研',
    input: '调研新能源汽车市场',
    expected: { skill_id: 'market', category: 'research', department: 'Planning' }
  },
  {
    name: '学术研究',
    input: '写一篇学术论文',
    expected: { skill_id: 'academic', category: 'research', department: 'Planning' }
  },
  {
    name: '数据分析',
    input: '分析这份数据',
    expected: { skill_id: 'data', category: 'research', department: 'Planning' }
  }
];

function runSkillMatcher(input) {
  try {
    const output = execSync(`node "${SKILL_MATCHER}" "${input}"`, { encoding: 'utf-8' });
    return JSON.parse(output);
  } catch (e) {
    return { error: e.message };
  }
}

function getDepartment(category) {
  const mapping = {
    software: 'Operations',
    hardware: 'Operations',
    creative: 'Operations',
    simulation: 'Planning',
    research: 'Planning'
  };
  return mapping[category] || 'Unknown';
}

console.log('═══════════════════════════════════════════════════════════');
console.log('         AgentGV Router Test Suite');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}: ${test.name}`);
  console.log(`Input: "${test.input}"`);

  const result = runSkillMatcher(test.input);

  if (result.error) {
    console.log(`❌ FAIL: ${result.error}`);
    failed++;
  } else {
    const actualDepartment = getDepartment(result.category);
    const pass =
      result.skill_id === test.expected.skill_id &&
      result.category === test.expected.category &&
      actualDepartment === test.expected.department;

    if (pass) {
      console.log(`✅ PASS`);
      console.log(
        `   Skill: ${result.skill_id} | Category: ${result.category} | Department: ${actualDepartment}`
      );
      passed++;
    } else {
      console.log(`❌ FAIL`);
      console.log(
        `   Expected: skill=${test.expected.skill_id}, category=${test.expected.category}, dept=${test.expected.department}`
      );
      console.log(
        `   Got:      skill=${result.skill_id}, category=${result.category}, dept=${actualDepartment}`
      );
      failed++;
    }
  }

  console.log('');
});

console.log('═══════════════════════════════════════════════════════════');
console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
console.log('═══════════════════════════════════════════════════════════');

process.exit(failed > 0 ? 1 : 0);
