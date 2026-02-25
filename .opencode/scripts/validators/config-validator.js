#!/usr/bin/env node

/**
 * AgentGV Configuration Validator
 *
 * Validates configuration files against JSON Schema definitions.
 *
 * Usage:
 *   node config-validator.js                    # Validate all configs
 *   node config-validator.js --schema models    # Validate models.json only
 *   node config-validator.js --schema skills    # Validate skills.json only
 *   node config-validator.js --schema commands  # Validate commands.json only
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Configuration
const CONFIG = {
  baseDir: path.resolve(__dirname, '..', '..'), // Go up two levels to .opencode
  schemas: {
    models: 'schemas/models.schema.json',
    skills: 'schemas/skills.schema.json',
    commands: 'schemas/config.schema.json'
  },
  configs: {
    models: 'models.json',
    skills: 'skills.json',
    commands: 'commands.json'
  }
};

// Colors for output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Error handling
class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Logger
class Logger {
  static success(message) {
    console.log(`${COLORS.green}✓${COLORS.reset} ${message}`);
  }

  static error(message) {
    console.log(`${COLORS.red}✗${COLORS.reset} ${message}`);
  }

  static warning(message) {
    console.log(`${COLORS.yellow}⚠${COLORS.reset} ${message}`);
  }

  static info(message) {
    console.log(`${COLORS.blue}ℹ${COLORS.reset} ${message}`);
  }

  static header(message) {
    console.log(`\n${COLORS.cyan}${message}${COLORS.reset}`);
    console.log('─'.repeat(message.length));
  }
}

// Load JSON file
function loadJSON(filePath) {
  try {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(CONFIG.baseDir, filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

// Validate configuration against schema
function validateConfig(schemaName, schemaPath, configPath) {
  Logger.info(`Validating ${schemaName}...`);

  // Load schema
  const schema = loadJSON(schemaPath);

  // Load configuration
  const config = loadJSON(configPath);

  // Create AJV instance
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    messages: true
  });

  // Add formats
  try {
    addFormats(ajv);
  } catch (e) {
    // ajv-formats is optional, continue without it
  }

  // Compile schema
  const validate = ajv.compile(schema);

  // Validate
  const valid = validate(config);

  if (!valid) {
    const errors = validate.errors.map(err => ({
      instancePath: err.instancePath || 'root',
      schemaPath: err.schemaPath,
      message: err.message,
      keyword: err.keyword
    }));
    throw new ValidationError(
      `${schemaName} validation failed with ${errors.length} error(s)`,
      errors
    );
  }

  Logger.success(`${schemaName} is valid`);
  return true;
}

// Format validation errors
function formatErrors(errors, schemaName) {
  console.log(`\n${COLORS.red}Validation Errors for ${schemaName}:${COLORS.reset}`);

  errors.forEach((error, index) => {
    console.log(`\n${COLORS.yellow}Error ${index + 1}:${COLORS.reset}`);
    console.log(`  Path: ${error.instancePath}`);
    console.log(`  Issue: ${error.message}`);
    console.log(`  Keyword: ${error.keyword}`);

    // Provide helpful suggestions
    const suggestion = getSuggestion(error);
    if (suggestion) {
      console.log(`  💡 ${suggestion}`);
    }
  });
}

// Get helpful suggestions based on error type
function getSuggestion(error) {
  const suggestions = {
    required: 'This field is required but missing',
    type: 'The value has an incorrect type',
    enum: 'The value must be one of the allowed options',
    pattern: 'The value does not match the required pattern',
    minimum: 'The value is below the minimum allowed',
    maximum: 'The value exceeds the maximum allowed',
    minItems: 'The array has too few items',
    minProperties: 'The object has too few properties',
    minLength: 'The string is too short',
    additionalProperties: 'Unexpected property found'
  };

  if (suggestions[error.keyword]) {
    return suggestions[error.keyword];
  }

  if (error.keyword === 'type' && error.instancePath) {
    return `Expected type does not match. Check the value at "${error.instancePath}"`;
  }

  return null;
}

// Main validation function
function validateAll() {
  let allValid = true;
  const results = {};

  Logger.header('AgentGV Configuration Validator');
  console.log(`Base directory: ${CONFIG.baseDir}\n`);

  // Validate each configuration
  for (const [name, schemaFile] of Object.entries(CONFIG.schemas)) {
    const configName = CONFIG.configs[name];

    try {
      const valid = validateConfig(
        name,
        schemaFile, // Use relative path
        configName // Use relative path
      );
      results[name] = { valid: true };
    } catch (error) {
      allValid = false;
      results[name] = { valid: false, error: error.message };

      if (error instanceof ValidationError) {
        formatErrors(error.errors, name);
      } else {
        Logger.error(error.message);
      }
    }
  }

  // Summary
  Logger.header('Validation Summary');

  for (const [name, result] of Object.entries(results)) {
    if (result.valid) {
      Logger.success(`${name}: Valid`);
    } else {
      Logger.error(`${name}: Invalid - ${result.error}`);
    }
  }

  console.log();

  if (allValid) {
    Logger.success('All configurations are valid! ✅');
    return 0;
  } else {
    Logger.error('Some configurations have errors. Please fix them and try again. ❌');
    return 1;
  }
}

// Validate specific schema
function validateSpecific(schemaName) {
  if (!CONFIG.schemas[schemaName]) {
    Logger.error(`Unknown schema: ${schemaName}`);
    Logger.info(`Available schemas: ${Object.keys(CONFIG.schemas).join(', ')}`);
    return 1;
  }

  Logger.header(`AgentGV Configuration Validator - ${schemaName}`);

  try {
    validateConfig(
      schemaName,
      CONFIG.schemas[schemaName], // Use relative path
      CONFIG.configs[schemaName] // Use relative path
    );
    Logger.success(`${schemaName} configuration is valid! ✅`);
    return 0;
  } catch (error) {
    if (error instanceof ValidationError) {
      formatErrors(error.errors, schemaName);
    } else {
      Logger.error(error.message);
    }
    return 1;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--schema' && args[i + 1]) {
      options.schema = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    } else if (args[i] === '--verbose' || args[i] === '-v') {
      options.verbose = true;
    }
  }

  return options;
}

// Show help
function showHelp() {
  console.log(`
${COLORS.cyan}AgentGV Configuration Validator${COLORS.reset}

Validates configuration files against JSON Schema definitions.

${COLORS.yellow}Usage:${COLORS.reset}
  node config-validator.js [options]

${COLORS.yellow}Options:${COLORS.reset}
  --schema <name>   Validate specific schema (models, skills, commands)
  --help, -h        Show this help message
  --verbose, -v     Show detailed output

${COLORS.yellow}Examples:${COLORS.reset}
  node config-validator.js                    # Validate all configs
  node config-validator.js --schema models    # Validate models.json only
  node config-validator.js --schema skills    # Validate skills.json only
`);
}

// Main entry point
function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  let exitCode;

  if (options.schema) {
    exitCode = validateSpecific(options.schema);
  } else {
    exitCode = validateAll();
  }

  process.exit(exitCode);
}

// Run
main();
