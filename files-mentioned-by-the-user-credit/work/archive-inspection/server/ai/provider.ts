export interface AIRequest {
  task: 'economic-verification';
  systemInstruction: string;
  input: Record<string, unknown>;
  demoResponse: Record<string, unknown>;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
}

/** Provider adapters may propose an assessment; they never commit economic state. */
export interface AIProvider {
  readonly id: string;
  readonly displayName: string;
  generate(request: AIRequest): Promise<AIResponse>;
}

export class DeterministicDemoProvider implements AIProvider {
  readonly id = 'demo';
  readonly displayName = 'Deterministic AI Demo Runtime';

  async generate(request: AIRequest): Promise<AIResponse> {
    return {
      content: JSON.stringify(request.demoResponse),
      provider: this.id,
      model: 'deterministic-policy-v1',
    };
  }
}

/** A minimal, provider-neutral HTTP adapter for optional remote inference. */
export class RemoteInferenceProvider implements AIProvider {
  readonly id = 'remote';
  readonly displayName = 'Remote AI Model Provider';

  constructor(
    private readonly endpoint: string,
    private readonly apiKey: string,
    private readonly model = 'configured-model',
  ) {}

  async generate(request: AIRequest): Promise<AIResponse> {
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

    if (!response.ok) throw new Error(`Remote inference returned ${response.status}`);

    const payload = await response.json() as { content?: unknown; output?: unknown; result?: unknown };
    const content = payload.content ?? payload.output ?? payload.result;
    if (typeof content === 'string') return { content, provider: this.id, model: this.model };
    if (content && typeof content === 'object') return { content: JSON.stringify(content), provider: this.id, model: this.model };
    throw new Error('Remote inference response did not contain a JSON result');
  }
}
