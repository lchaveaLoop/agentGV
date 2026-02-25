const fs = require('fs');
const path = require('path');
const CONFIG = path.join(__dirname, 'models.json');
const AGENTS = path.join(__dirname, 'agents');

async function detect() {
  const config = JSON.parse(fs.readFileSync(CONFIG, 'utf-8'));
  const available = ['minimax/m2.5', 'minimax/m1'];
  
  for (const [agent, map] of Object.entries(config.agent_model_mapping)) {
    const model = available.includes(map.primary) ? map.primary : map.fallback;
    const p = path.join(AGENTS, `${agent}.md`);
    let c = fs.readFileSync(p, 'utf-8');
    c = c.replace(/^model:.*$/m, `model: ${model}`);
    c = c.replace(/^temperature:.*$/m, `temperature: ${map.temperature}`);
    fs.writeFileSync(p, c);
    console.log(`✓ ${agent}: ${model} (temp: ${map.temperature})`);
  }
}

if (require.main === module) {detect();}
module.exports = { detect };
