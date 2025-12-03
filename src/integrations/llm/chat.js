import { ChatOpenAI, AzureChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

// Environment variables
const LLM_PROVIDER = process.env.LLM_PROVIDER || "openai";

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Azure OpenAI configuration
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_DEPLOYMENT_NAME = process.env.AZURE_DEPLOYMENT_NAME || "gpt-4o";
const AZURE_API_VERSION = process.env.AZURE_API_VERSION || "2024-08-01-preview";

// Anthropic configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";

/**
 * Singleton LLM client instance
 */
let llmClient = null;

/**
 * Create an LLM client based on the configured provider
 * Supports Azure OpenAI, OpenAI, and Anthropic
 * @returns {ChatOpenAI | AzureChatOpenAI | ChatAnthropic} Initialized LLM client
 */
export function createLLMClient() {
  if (llmClient) {
    return llmClient;
  }

  const provider = LLM_PROVIDER.toLowerCase();

  switch (provider) {
    case "azure":
      if (!AZURE_OPENAI_API_KEY || !AZURE_OPENAI_ENDPOINT) {
        throw new Error(
          "Azure OpenAI requires AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT environment variables"
        );
      }
      llmClient = new AzureChatOpenAI({
        azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
        azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT,
        azureOpenAIApiDeploymentName: AZURE_DEPLOYMENT_NAME,
        azureOpenAIApiVersion: AZURE_API_VERSION,
        temperature: 0.7,
      });
      console.log(`[LLM] Initialized Azure OpenAI with deployment: ${AZURE_DEPLOYMENT_NAME}`);
      break;

    case "anthropic":
      if (!ANTHROPIC_API_KEY) {
        throw new Error(
          "Anthropic requires ANTHROPIC_API_KEY environment variable"
        );
      }
      llmClient = new ChatAnthropic({
        anthropicApiKey: ANTHROPIC_API_KEY,
        model: ANTHROPIC_MODEL,
        temperature: 0.7,
      });
      console.log(`[LLM] Initialized Anthropic with model: ${ANTHROPIC_MODEL}`);
      break;

    case "openai":
    default:
      if (!OPENAI_API_KEY) {
        throw new Error(
          "OpenAI requires OPENAI_API_KEY environment variable"
        );
      }
      llmClient = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY,
        model: OPENAI_MODEL,
        temperature: 0.7,
      });
      console.log(`[LLM] Initialized OpenAI with model: ${OPENAI_MODEL}`);
      break;
  }

  return llmClient;
}

/**
 * Send messages to the LLM and get a response
 * @param {Array} messages - Array of messages in LangChain format
 * @returns {Promise<Object>} - Response from the model
 */
export async function invokeLLM(messages) {
  try {
    const model = createLLMClient();
    return await model.invoke(messages);
  } catch (error) {
    console.error("Error invoking LLM:", error);
    throw new Error(`LLM invocation failed: ${error.message}`);
  }
}

/**
 * Stream responses from the LLM
 * @param {Array} messages - Array of messages in LangChain format
 * @returns {Promise<AsyncIterable>} - Stream of responses
 */
export async function streamFromLLM(messages) {
  try {
    const model = createLLMClient();
    return await model.stream(messages);
  } catch (error) {
    console.error("Error streaming from LLM:", error);
    throw new Error(`LLM streaming failed: ${error.message}`);
  }
}

/**
 * Get the current LLM provider name
 * @returns {string} Current provider name
 */
export function getLLMProvider() {
  return LLM_PROVIDER;
}

/**
 * Reset the LLM client (useful for testing or reconfiguration)
 */
export function resetLLMClient() {
  llmClient = null;
}


