/**
 * AgentGV Plugin for OpenCode
 * 
 * This plugin provides multi-agent orchestration for OpenCode:
 * - Router: Main task router
 * - Administration: Autonomous execution
 * - Planning: Architecture and research
 * - Operations: Development and implementation
 * - Quality: Testing and review
 * 
 * Installation:
 * Add to ~/.config/opencode/opencode.json:
 * {
 *   "plugin": ["agentgv"]
 * }
 */

import type { Plugin } from "@opencode-ai/plugin";

// Plugin configuration
const agentgvConfig = {
  agents: {
    router: {
      name: "agentgv-router",
      description: "Intelligent task router with project coordination capabilities",
      mode: "primary" as const,
      hidden: false,
    },
    administration: {
      name: "agentgv-administration", 
      description: "Project coordination and autonomous execution specialist",
      mode: "subagent" as const,
      hidden: true,
    },
    planning: {
      name: "agentgv-planning",
      description: "System architecture, technical design, and research specialist",
      mode: "subagent" as const,
      hidden: true,
    },
    operations: {
      name: "agentgv-operations",
      description: "Development, implementation, and technical documentation specialist",
      mode: "subagent" as const,
      hidden: true,
    },
    quality: {
      name: "agentgv-quality",
      description: "Testing and quality assurance specialist",
      mode: "subagent" as const,
      hidden: true,
    },
  },
};

// Export plugin
const agentgvPlugin: Plugin = async (ctx) => {
  console.log("[AgentGV Plugin] Loading agents...");
  
  return {
    // Plugin metadata
    name: "agentgv",
    version: "4.3.2",
    
    // Register agents
    agents: Object.values(agentgvConfig.agents),
  };
};

export default agentgvPlugin;
