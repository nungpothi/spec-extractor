Add OpenRouter provider support to the existing LLM provider system.

Requirements:
- The backend currently supports two providers: "ollama" and "openai".
- Add support for a third provider: "openrouter".

Environment variables:
  LLM_PROVIDER=openrouter
  OPENROUTER_API_KEY=sk-or-xxxxx
  OPENROUTER_MODEL=openai/gpt-4o-mini
  OPENROUTER_BASE_URL=https://openrouter.ai/api/v1/chat/completions

Implementation rules:
1. In the LLM provider layer:
   - Add a case for LLM_PROVIDER === 'openrouter'.
   - Use fetch or axios to POST to ${OPENROUTER_BASE_URL}.
   - Headers must include:
     ```
     Authorization: Bearer ${OPENROUTER_API_KEY}
     Content-Type: application/json
     HTTP-Referer: https://your-app.localhost (or your domain)
     X-Title: Your App Name (optional)
     ```
   - Body structure follows the OpenAI-compatible schema:
     {
       "model": process.env.OPENROUTER_MODEL,
       "messages": [
         { "role": "system", "content": systemPrompt },
         { "role": "user", "content": userPrompt }
       ]
     }
   - Parse the response and return text from response.data.choices[0].message.content.

2. Keep the same function signature:
async function llmGenerate({ systemPrompt, userPrompt }): Promise<string>
and make it work seamlessly with "ollama", "openai", and now "openrouter".

3. On startup, log:
`[LLM] Using provider: openrouter (model: ${OPENROUTER_MODEL})`

4. Add minimal error handling:
- If API key missing → throw clear error message.
- If request fails → log status and reason.

5. Do not remove or modify existing Ollama/OpenAI logic; just extend it.
6. All logs in English and concise.

Output only the new or updated TypeScript code — no explanations.
and make it work seamlessly with "ollama", "openai", and now "openrouter".

3. On startup, log:
`[LLM] Using provider: openrouter (model: ${OPENROUTER_MODEL})`

4. Add minimal error handling:
- If API key missing → throw clear error message.
- If request fails → log status and reason.

5. Do not remove or modify existing Ollama/OpenAI logic; just extend it.
6. All logs in English and concise.

Output only the new or updated TypeScript code — no explanations.
