# Spec Extractor

Backend includes automatic Excel spec analysis and Local LLM support.

## Local LLM Support

Configure a local, open‑source LLM (e.g., LLaMA 3 8B, Mistral 7B, GPT‑J 6B) via environment variables. The backend will attempt to use a local model first (via `LLM_PROVIDER=ollama`) and will automatically fall back to OpenAI if the model is unavailable or GPU VRAM is insufficient.

Environment variables:

```
LLM_PROVIDER=ollama        # or 'openai' for direct OpenAI use
LLM_MODEL=llama3-8b
LLM_MODEL_PATH=/models/llama3-8b
LLM_QUANTIZE=Q4            # optional quantization mode
OPENAI_API_KEY=sk-...      # required for OpenAI fallback
```

On startup, logs indicate:

- Using local model ${LLM_MODEL} from path ${LLM_MODEL_PATH}
- Or: Falling back to OpenAI

When `LLM_PROVIDER=ollama`, the provider will launch the specified model using the Ollama CLI (example):

```
ollama run ${LLM_MODEL} --model-path ${LLM_MODEL_PATH} --quantize ${LLM_QUANTIZE} "<prompt>"
```

### Supported Open Models (examples)

- LLaMA 3 8B (Meta)
- Mistral 7B (Mistral AI)
- GPT‑J 6B (EleutherAI)

These models can run on consumer GPUs; quantized variants (e.g., Q4) are recommended for 8 GB VRAM.

### Approximate VRAM Requirements

- 7B class models (e.g., LLaMA 3 8B, Mistral 7B): ~8 GB with Q4 quantization
- 13B class models: ~12–16 GB with quantization

References and benchmarking:

- Ollama model library: https://ollama.com/library
- llama.cpp performance and hardware notes: https://github.com/ggerganov/llama.cpp#performance
- LLaMA 3 overview: https://huggingface.co/blog/llama3

An NVIDIA RTX 4060 (8 GB VRAM) is generally suitable for 7B class models using Q4 quantization; performance varies by quantization level and context length (see references above).

