#!/usr/bin/env node

/**
 * Real-time Usage Statistics Tracker
 * Tracks and displays usage statistics in real-time
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STATS_FILE = path.join(__dirname, 'usage-stats.json');
const SKILLS_FILE = path.join(__dirname, 'skills.json');

// Initialize stats file if not exists
function initStats() {
  const stats = {
    period: new Date().toISOString().slice(0, 7),
    last_updated: new Date().toISOString(),
    total_requests: 0,
    by_model: {
      "qwen3-max-2026-01-23": {"count": 0, "tokens_used": 0, "tokens_prompt": 0},
      "qwen3.5-plus": {"count": 0, "tokens_used": 0, "tokens_prompt": 0},
      "qwen3-coder-plus": {"count": 0, "tokens_used": 0, "tokens_prompt": 0},
      "qwen3-coder-next": {"count": 0, "tokens_used": 0, "tokens_prompt": 0}
    },
    by_agent: {
      "router": {"count": 0, "success": 0, "failure": 0},
      "planning": {"count": 0, "success": 0, "failure": 0},
      "operations": {"count": 0, "success": 0, "failure": 0},
      "quality": {"count": 0, "success": 0, "failure": 0}
    },
    by_skill: {},
    by_task_type: {
      "architecture": {"count": 0},
      "research": {"count": 0},
      "coding": {"count": 0},
      "review": {"count": 0},
      "documentation": {"count": 0},
      "coordination": {"count": 0},
      "other": {"count": 0}
    },
    by_category: {
      "software": {"count": 0},
      "hardware": {"count": 0},
      "simulation": {"count": 0},
      "creative": {"count": 0},
      "research": {"count": 0}
    },
    by_preference: {
      "quality_priority": {"count": 0},
      "balanced": {"count": 0},
      "cost_saving": {"count": 0}
    },
    hourly_distribution: Array(24).fill(0),
    daily_requests: []
  };
  
  if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  }
  
  return stats;
}

// Load stats
function loadStats() {
  if (!fs.existsSync(STATS_FILE)) {
    return initStats();
  }
  return JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
}

// Save stats
function saveStats(stats) {
  stats.last_updated = new Date().toISOString();
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

// Track a request
function trackRequest(data) {
  const stats = loadStats();
  
  // Update period if needed
  const currentPeriod = new Date().toISOString().slice(0, 7);
  if (stats.period !== currentPeriod) {
    stats.period = currentPeriod;
    // Reset monthly counts but keep historical daily data
  }
  
  // Update totals
  stats.total_requests++;
  
  // Update by_model
  if (data.model && stats.by_model[data.model]) {
    stats.by_model[data.model].count++;
    if (data.tokens) {
      stats.by_model[data.model].tokens_used += data.tokens.total || 0;
      stats.by_model[data.model].tokens_prompt += data.tokens.prompt || 0;
    }
  }
  
  // Update by_agent
  if (data.agent && stats.by_agent[data.agent]) {
    stats.by_agent[data.agent].count++;
    if (data.success !== undefined) {
      stats.by_agent[data.agent][data.success ? 'success' : 'failure']++;
    }
  }
  
  // Update by_skill
  if (data.skill) {
    if (!stats.by_skill[data.skill]) {
      stats.by_skill[data.skill] = {count: 0, category: data.category || 'unknown'};
    }
    stats.by_skill[data.skill].count++;
  }
  
  // Update by_task_type
  if (data.task_type && stats.by_task_type[data.task_type]) {
    stats.by_task_type[data.task_type].count++;
  } else {
    stats.by_task_type.other.count++;
  }
  
  // Update by_category
  if (data.category && stats.by_category[data.category]) {
    stats.by_category[data.category].count++;
  }
  
  // Update by_preference
  const pref = data.preference || 'quality_priority';
  if (stats.by_preference[pref]) {
    stats.by_preference[pref].count++;
  }
  
  // Update hourly distribution
  const hour = new Date().getHours();
  stats.hourly_distribution[hour]++;
  
  // Update daily requests
  const today = new Date().toISOString().slice(0, 10);
  const todayIndex = stats.daily_requests.findIndex(d => d.date === today);
  if (todayIndex >= 0) {
    stats.daily_requests[todayIndex].count++;
  } else {
    stats.daily_requests.push({date: today, count: 1});
    // Keep only last 30 days
    if (stats.daily_requests.length > 30) {
      stats.daily_requests.shift();
    }
  }
  
  saveStats(stats);
  return stats;
}

// Display real-time stats
function displayStats(live = false) {
  const stats = loadStats();
  
  const clearScreen = () => {
    console.clear();
    console.log('\x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[36m║\x1b[0m       \x1b[1mAgentGV Real-time Usage Statistics\x1b[0m             \x1b[36m║\x1b[0m');
    console.log('\x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m');
    console.log(`\x1b[90mPeriod: ${stats.period} | Last updated: ${new Date(stats.last_updated).toLocaleString()}\x1b[0m\n`);
  };
  
  const display = () => {
    clearScreen();
    
    // Total requests
    console.log(`\x1b[1m📊 Total Requests: \x1b[32m${stats.total_requests}\x1b[0m\n`);
    
    // By Agent
    console.log(`\x1b[1m🤖 By Agent:\x1b[0m`);
    for (const [agent, data] of Object.entries(stats.by_agent)) {
      const bar = '█'.repeat(Math.floor(data.count / 1));
      console.log(`  ${agent.padEnd(12)} \x1b[36m${bar}\x1b[0m ${data.count} ✓${data.success} ✗${data.failure}`);
    }
    
    // By Skill (top 10)
    console.log(`\n\x1b[1m💡 Top Skills:\x1b[0m`);
    const sortedSkills = Object.entries(stats.by_skill)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);
    sortedSkills.forEach(([skill, data], i) => {
      console.log(`  ${i+1}. ${skill.padEnd(20)} ${data.count} (${data.category})`);
    });
    
    // By Category
    console.log(`\n\x1b[1m📁 By Category:\x1b[0m`);
    for (const [cat, data] of Object.entries(stats.by_category)) {
      console.log(`  ${cat.padEnd(12)} ${data.count}`);
    }
    
    // By Model
    console.log(`\n\x1b[1m🧠 By Model:\x1b[0m`);
    for (const [model, data] of Object.entries(stats.by_model)) {
      if (data.count > 0) {
        console.log(`  ${model.padEnd(30)} ${data.count} (tokens: ${data.tokens_used})`);
      }
    }
    
    // Hourly distribution
    console.log(`\n\x1b[1m🕐 Hourly Distribution (today):\x1b[0m`);
    const maxHour = Math.max(...stats.hourly_distribution);
    for (let i = 0; i < 24; i++) {
      const count = stats.hourly_distribution[i];
      const bar = '█'.repeat(Math.floor((count / maxHour) * 20)) || '·';
      console.log(`  ${i.toString().padStart(2)}:00 \x1b[33m${bar}\x1b[0m ${count}`);
    }
    
    // Daily trend (last 7 days)
    console.log(`\n\x1b[1m📈 Daily Trend (last 7 days):\x1b[0m`);
    const last7Days = stats.daily_requests.slice(-7);
    const maxDay = Math.max(...last7Days.map(d => d.count), 1);
    last7Days.forEach(day => {
      const bar = '█'.repeat(Math.floor((day.count / maxDay) * 30));
      const date = new Date(day.date).toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'});
      console.log(`  ${date.padEnd(5)} \x1b[32m${bar}\x1b[0m ${day.count}`);
    });
    
    if (live) {
      console.log(`\n\x1b[90mPress Ctrl+C to exit | Auto-refresh every 2s\x1b[0m`);
    }
  };
  
  display();
  
  if (live) {
    setInterval(display, 2000);
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--live') || args.includes('-l')) {
    displayStats(true);
  } else if (args.includes('--json') || args.includes('-j')) {
    console.log(JSON.stringify(loadStats(), null, 2));
  } else if (args.includes('--reset')) {
    fs.unlinkSync(STATS_FILE);
    initStats();
    console.log('✓ Stats reset successfully');
  } else {
    displayStats(false);
  }
}

module.exports = { initStats, loadStats, saveStats, trackRequest, displayStats };
