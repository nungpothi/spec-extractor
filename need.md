Add support for an open-source local LLM model in the existing Node.js + TypeScript backend.

Requirements:
- Use an environment variable `LLM_MODEL` which can be changed to pick model name (e.g., "llama3-8b", "mistral-7b", "gpt-j-6b").
- Install and configure inference using a lightweight open-source model compatible with consumer GPU (such as LLaMA 3 8B or Mistral 7B) that can run on an NVIDIA 4060.
- Integrate with the previously created llmProvider layer (`llmGenerate({systemPrompt, userPrompt})`).
- Add env variables:
    LLM_MODEL=llama3-8b
    LLM_MODEL_PATH=/models/llama3-8b
    LLM_QUANTIZE=Q4 // optional quantization mode
- The provider layer should dynamically load the model path and configuration from env, and if `LLM_PROVIDER=ollama`, launch the specified model via Ollama CLI or Docker, e.g.:
`ollama run ${LLM_MODEL} --model-path ${LLM_MODEL_PATH} --quantize ${LLM_QUANTIZE}`
- Ensure error handling: if model not found or GPU VRAM insufficient, fallback to `openai` provider automatically.
- On startup log: “Using local model ${LLM_MODEL} from path ${LLM_MODEL_PATH}” or “Falling back to OpenAI”.
- Document in README: which free/open models are supported, approximate VRAM required (e.g., 8 GB for 7B model, 12-16GB for 13B) with link to external benchmarking for RTX 4060. Use citations accordingly.

Output only the updated/added TypeScript source files and README changes (no extra explanation).
