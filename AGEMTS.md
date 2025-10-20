# Codex Agents Definition

## extract-spec-excel
- purpose: Extract and normalize API specification tables from Excel files.
- input: JSON structure (one sheet per object) containing "columns" and "rows".
- output: Markdown tables with a fixed 8-column format including metadata (URL, Method, Entity).
- language: English (responds in English with brief Thai explanations in description fields).
- askback-language: Thai
- logic:
    - Detect HTTP method automatically (GET, POST, PUT, DELETE).
    - If wrong method or misplaced section detected (e.g., POST with Query String), ask user in Thai to confirm correction.
    - Generate Markdown tables with exactly 8 columns: parameter, dataType, required, possibleValues, description, dataFormat, example, errorCode.
    - Preserve the same table structure across all outputs.
    - Include Markdown sections for: Header, Query String or Body (depending on method), and Response.
    - Ask before filling empty or missing sections.
    - Separate multiple APIs into independent results.
- prompt: ./PROMPTS/extract-spec-excel.md
