// PostToolUse (Write|Edit): lint the edited .ts/.tsx file and feed errors back to Claude (exit 2).
import { ESLint } from "eslint";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const { tool_input = {}, tool_response = {} } = JSON.parse(raw || "{}");
const file = tool_input.file_path ?? tool_response.filePath;
if (!file || !/\.(ts|tsx)$/.test(file)) process.exit(0);

const eslint = new ESLint({ cwd: process.env.CLAUDE_PROJECT_DIR ?? process.cwd() });
if (await eslint.isPathIgnored(file)) process.exit(0);
const results = await eslint.lintFiles([file]);
if (results.some((r) => r.errorCount > 0)) {
  const formatter = await eslint.loadFormatter("stylish");
  process.stderr.write(await formatter.format(results));
  process.exit(2);
}
