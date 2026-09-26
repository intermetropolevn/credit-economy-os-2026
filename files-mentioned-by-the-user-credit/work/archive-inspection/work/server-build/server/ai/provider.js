export class DeterministicDemoProvider {
    id = 'demo';
    displayName = 'Deterministic AI Demo Runtime';
    async generate(request) {
        return {
            content: JSON.stringify(request.demoResponse),
            provider: this.id,
            model: 'deterministic-policy-v1',
        };
    }
}
/** A minimal, provider-neutral HTTP adapter for optional remote inference. */
export class RemoteInferenceProvider {
    endpoint;
    apiKey;
    model;
    id = 'remote';
    displayName = 'Remote AI Model Provider';
    constructor(endpoint, apiKey, model = 'configured-model') {
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.model = model;
    }
    async generate(request) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                task: request.task,
                model: this.model,
                systemInstruction: request.systemInstruction,
                input: request.input,
                responseFormat: 'json',
            }),
        });
        if (!response.ok)
            throw new Error(`Remote inference returned ${response.status}`);
        const payload = await response.json();
        const content = payload.content ?? payload.output ?? payload.result;
        if (typeof content === 'string')
            return { content, provider: this.id, model: this.model };
        if (content && typeof content === 'object')
            return { content: JSON.stringify(content), provider: this.id, model: this.model };
        throw new Error('Remote inference response did not contain a JSON result');
    }
}
