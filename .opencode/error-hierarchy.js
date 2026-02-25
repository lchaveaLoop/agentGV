#!/usr/bin/env node

/**
 * AgentGV Error Hierarchy
 *
 * Structured error handling system inspired by Anthropic's SDK.
 * Provides layered error types with clear messages and recovery suggestions.
 *
 * Usage:
 *   const { AgentGVError, SkillError, ConfigError } = require('./error-hierarchy.js');
 *
 *   try {
 *     throw new SkillError('Skill not found', { skillId: 'fiction' });
 *   } catch (error) {
 *     if (error instanceof AgentGVError) {
 *       console.log(error.toUserMessage());
 *     }
 *   }
 */

/**
 * Base error class for all AgentGV errors
 */
class AgentGVError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'AgentGVError';
    this.code = options.code || 'AGENTGV_ERROR';
    this.details = options.details || {};
    this.suggestion = options.suggestion || null;
    this.recoverable = options.recoverable !== false;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgentGVError);
    }
  }

  /**
   * Convert to user-friendly message
   */
  toUserMessage() {
    let message = `❌ ${this.message}`;

    if (this.details && Object.keys(this.details).length > 0) {
      message += '\n\nDetails:';
      for (const [key, value] of Object.entries(this.details)) {
        message += `\n  • ${key}: ${value}`;
      }
    }

    if (this.suggestion) {
      message += `\n\n💡 Suggestion: ${this.suggestion}`;
    }

    return message;
  }

  /**
   * Convert to JSON for logging/API
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      suggestion: this.suggestion,
      recoverable: this.recoverable,
      timestamp: this.timestamp
    };
  }
}

/**
 * Skill-related errors
 */
class SkillError extends AgentGVError {
  constructor(message, options = {}) {
    super(message, {
      ...options,
      code: options.code || 'SKILL_ERROR'
    });
    this.name = 'SkillError';
  }
}

class SkillNotFoundError extends SkillError {
  constructor(skillId) {
    super(`Skill not found: ${skillId}`, {
      code: 'SKILL_NOT_FOUND',
      details: { skillId },
      suggestion: 'Check skill ID and ensure skill is installed',
      recoverable: true
    });
    this.name = 'SkillNotFoundError';
  }
}

class SkillLoadError extends SkillError {
  constructor(skillId, reason) {
    super(`Failed to load skill: ${skillId}`, {
      code: 'SKILL_LOAD_ERROR',
      details: { skillId, reason },
      suggestion: 'Verify skill file is valid YAML + Markdown',
      recoverable: true
    });
    this.name = 'SkillLoadError';
  }
}

/**
 * Configuration errors
 */
class ConfigError extends AgentGVError {
  constructor(message, options = {}) {
    super(message, {
      ...options,
      code: options.code || 'CONFIG_ERROR'
    });
    this.name = 'ConfigError';
  }
}

class ConfigNotFoundError extends ConfigError {
  constructor(configFile) {
    super(`Configuration file not found: ${configFile}`, {
      code: 'CONFIG_NOT_FOUND',
      details: { configFile },
      suggestion: `Create ${configFile} or check file path`,
      recoverable: false
    });
    this.name = 'ConfigNotFoundError';
  }
}

class ConfigParseError extends ConfigError {
  constructor(configFile, reason) {
    super(`Failed to parse configuration: ${configFile}`, {
      code: 'CONFIG_PARSE_ERROR',
      details: { configFile, reason },
      suggestion: 'Check JSON/YAML syntax',
      recoverable: false
    });
    this.name = 'ConfigParseError';
  }
}

/**
 * Router errors
 */
class RouterError extends AgentGVError {
  constructor(message, options = {}) {
    super(message, {
      ...options,
      code: options.code || 'ROUTER_ERROR'
    });
    this.name = 'RouterError';
  }
}

class DepartmentNotFoundError extends RouterError {
  constructor(taskType) {
    super(`No department found for task type: ${taskType}`, {
      code: 'DEPARTMENT_NOT_FOUND',
      details: { taskType },
      suggestion: 'Check task type mapping in router configuration',
      recoverable: true
    });
    this.name = 'DepartmentNotFoundError';
  }
}

class ModelSyncError extends RouterError {
  constructor(reason) {
    super(`Model synchronization failed`, {
      code: 'MODEL_SYNC_ERROR',
      details: { reason },
      suggestion: 'Check model configuration and network connection',
      recoverable: true
    });
    this.name = 'ModelSyncError';
  }
}

/**
 * Agent errors
 */
class AgentError extends AgentGVError {
  constructor(message, options = {}) {
    super(message, {
      ...options,
      code: options.code || 'AGENT_ERROR'
    });
    this.name = 'AgentError';
  }
}

class AgentTimeoutError extends AgentError {
  constructor(agentId, timeout) {
    super(`Agent timeout: ${agentId}`, {
      code: 'AGENT_TIMEOUT',
      details: { agentId, timeout },
      suggestion: 'Increase timeout or check agent performance',
      recoverable: true
    });
    this.name = 'AgentTimeoutError';
  }
}

class AgentExecutionError extends AgentError {
  constructor(agentId, reason) {
    super(`Agent execution failed: ${agentId}`, {
      code: 'AGENT_EXECUTION_ERROR',
      details: { agentId, reason },
      suggestion: 'Check agent logs and retry',
      recoverable: true
    });
    this.name = 'AgentExecutionError';
  }
}

/**
 * API errors
 */
class APIError extends AgentGVError {
  constructor(message, options = {}) {
    super(message, {
      ...options,
      code: options.code || 'API_ERROR',
      statusCode: options.statusCode || 500
    });
    this.name = 'APIError';
    this.statusCode = options.statusCode;
  }
}

class RateLimitError extends APIError {
  constructor(resetTime) {
    super('Rate limit exceeded', {
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
      details: { resetTime },
      suggestion: `Wait until ${resetTime} or upgrade plan`,
      recoverable: true
    });
    this.name = 'RateLimitError';
  }
}

class AuthenticationError extends APIError {
  constructor(reason) {
    super('Authentication failed', {
      code: 'AUTHENTICATION_FAILED',
      statusCode: 401,
      details: { reason },
      suggestion: 'Check API key and authentication credentials',
      recoverable: false
    });
    this.name = 'AuthenticationError';
  }
}

/**
 * Error factory functions
 */
function createError(type, ...args) {
  const errorClasses = {
    SkillNotFound: SkillNotFoundError,
    SkillLoad: SkillLoadError,
    ConfigNotFound: ConfigNotFoundError,
    ConfigParse: ConfigParseError,
    DepartmentNotFound: DepartmentNotFoundError,
    ModelSync: ModelSyncError,
    AgentTimeout: AgentTimeoutError,
    AgentExecution: AgentExecutionError,
    RateLimit: RateLimitError,
    Authentication: AuthenticationError
  };

  const ErrorClass = errorClasses[type];
  if (!ErrorClass) {
    throw new Error(`Unknown error type: ${type}`);
  }

  return new ErrorClass(...args);
}

/**
 * Error handler wrapper
 */
function handleError(error, context = {}) {
  console.error('═══ AgentGV Error ═══');

  if (error instanceof AgentGVError) {
    console.error(error.toUserMessage());
  } else {
    console.error(`❌ Unexpected error: ${error.message}`);
    console.error('💡 This is likely a bug. Please report with context:', context);
  }

  console.error('═══════════════════════\n');

  return error;
}

/**
 * Wrap async function with error handling
 */
function withErrorHandling(fn, errorHandler) {
  return async function (...args) {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error);
      if (errorHandler) {
        return errorHandler(error);
      }
      throw error;
    }
  };
}

// Export all error classes and utilities
module.exports = {
  // Base class
  AgentGVError,

  // Skill errors
  SkillError,
  SkillNotFoundError,
  SkillLoadError,

  // Config errors
  ConfigError,
  ConfigNotFoundError,
  ConfigParseError,

  // Router errors
  RouterError,
  DepartmentNotFoundError,
  ModelSyncError,

  // Agent errors
  AgentError,
  AgentTimeoutError,
  AgentExecutionError,

  // API errors
  APIError,
  RateLimitError,
  AuthenticationError,

  // Utilities
  createError,
  handleError,
  withErrorHandling
};
