You are to create or update a full-stack application called **Prompt Compiler**.

Goal:
A system where users type natural-language requirements (Thai or English),
and the backend uses an AI model to generate a complete developer specification.

---

### Functional Summary

1. The user interface works like a chat.
    - One input box at the bottom (multiline).
    - Each request and response are shown as stacked rows (top to bottom).
    - Each generated result is displayed in a vertical order:
        - Requirement summary (developer tone, English)
        - UI Mock (HTML or React code, rendered below)
        - API Spec (Markdown table)
        - Database Schema (Markdown table)
    - The layout must not split screen horizontally; everything scrolls vertically like a feed.

2. The backend endpoint `/api/compile-prompt`:
    - Input JSON:
      {
      "userText": string,
      "sessionId": string
      }
    - Behavior:
        - Store the userText into a table `conversation_history`
          (columns: id, sessionId, userInput, aiResponse, createdAt)
        - Call the LLM provider (Ollama / OpenRouter / OpenAI — switchable by env)
        - Use the following system prompt template:
          """
          You are a software system designer.
          Analyze the following user request and generate a structured system specification.
          Input: "<user_text>"
          Output JSON:
          {
          "summary": "main objective in concise developer language",
          "uiMock": "<html or react code snippet for UI mock>",
          "apiSpec": "markdown table showing URL, Method, Header, Body, Response",
          "dbSchema": "markdown table showing table name, fields, types"
          }
          """
        - Return the parsed JSON response.
        - Store the AI response into conversation_history.aiResponse.
    - Output JSON:
      {
      "summary": "...",
      "uiMock": "...",
      "apiSpec": "...",
      "dbSchema": "...",
      "sessionId": "..."
      }

3. Database:
    - Use PostgreSQL via TypeORM.
    - Table `conversation_history`
        - id (uuid, pk)
        - sessionId (string)
        - userInput (text)
        - aiResponse (jsonb)
        - createdAt (timestamp)
    - Auto-create sessionId if none is provided.

4. Environment variables:
   LLM_PROVIDER=openrouter|ollama|openai
   OPENROUTER_API_KEY=sk-or-xxxx
   OPENROUTER_MODEL=openai/gpt-4o-mini
   DATABASE_URL=postgresql://user:pass@localhost:5432/prompt_compiler
5. Frontend:
- Framework: React + TypeScript + TailwindCSS
- Components:
    - ChatList (renders all rows of conversation)
    - ChatInput (textbox at bottom)
    - Each AI response shows:
        - Section title (Summary / UI Mock / API Spec / DB Schema)
        - Rendered HTML (for uiMock)
        - Code blocks for API Spec and DB Schema (markdown style)
- When the user submits new text:
    - Send to `/api/compile-prompt`
    - Append the result as a new row below
    - Keep previous results visible
- Minimal pastel color theme, clean and modern.

6. Update AGENTS.md:
- Add or update an agent entry:
  ```
  ## prompt-compiler
  - purpose: Convert human natural language requirements into full developer specifications.
  - input: userText, sessionId
  - output: summary, uiMock, apiSpec, dbSchema
  - database: conversation_history
  - language: English (accepts Thai input)
  - logic:
    - Store conversation to DB
    - Call configured LLM provider
    - Return structured result for frontend rendering
  - prompt: ./PROMPTS/prompt-compiler.md
  ```
