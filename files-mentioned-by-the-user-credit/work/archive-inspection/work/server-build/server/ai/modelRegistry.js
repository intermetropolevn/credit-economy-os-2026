import { DeterministicDemoProvider, RemoteInferenceProvider } from './provider.js';
/** Selects a server-only provider. Demo mode is intentionally the default. */
export function resolveAIProvider(env = process.env) {
    const configuredProvider = (env.AI_PROVIDER || 'demo').toLowerCase();
    const endpoint = env.AI_INFERENCE_ENDPOINT;
    const apiKey = env.AI_INFERENCE_API_KEY;
    if (configuredProvider === 'remote' && endpoint && apiKey) {
        return { provider: new RemoteInferenceProvider(endpoint, apiKey, env.AI_MODEL), mode: 'remote' };
    }
    return { provider: new DeterministicDemoProvider(), mode: 'demo' };
}
