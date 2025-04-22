import { formatSuggestion, escapeHtml } from "./utils";
import { OLLAMACONFIG } from "./config";

// 🔹 Valida el prompt para evitar caracteres maliciosos
function sanitizePrompt(prompt: string): string {
    return prompt.replace(/[`"'<>\\]/g, ""); 
}

// 🔹 Función segura para parsear JSON
function safeJSONParse(text: string): any {
    try {
        return JSON.parse(text);
    } catch (error) {
        console.warn("Error al parsear JSON:", error);
        return null;
    }
}

// 🔹 Función para obtener respuesta de Ollama
async function fetchOllamaData(prompt: string) {
    if (!OLLAMACONFIG.API.startsWith("https://")) {
        throw new Error("¡Error de seguridad! La API debe usar HTTPS.");
    }

    const response = await fetch(OLLAMACONFIG.API + OLLAMACONFIG.ACTIONGENERATE, {
        method: OLLAMACONFIG.METHODPOST,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: OLLAMACONFIG.MODEL, prompt: sanitizePrompt(prompt), stream: true }),
        keepalive: true,
    });

    return response.body?.getReader();
}

// 🔹 Procesa la respuesta en streaming
async function processOllamaResponse(reader: ReadableStreamDefaultReader, onData: (response: string) => void) {
    let openBlock = false;
    let currentLang = "plaintext";
    let codeBuffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value).trim();
        const json = safeJSONParse(text);
        if (!json || !json.response) continue;

        let formatted = json.response;

        const tripleBacktickMatch = formatted.match(/^```(\w+)?/);
        if (tripleBacktickMatch) {
            openBlock = !openBlock;

            if (openBlock) {
                currentLang = tripleBacktickMatch[1] || "plaintext";
                codeBuffer = "";
            } else {
                const lines = codeBuffer.trim().split("\n").filter(line => line.trim() !== "");
                const firstLineMatch = lines.length > 0 ? lines[0].match(/^\s*(\w+)/) : null;

                if (firstLineMatch) {
                    currentLang = firstLineMatch[1].toLowerCase();
                    lines.shift();
                }

                codeBuffer = lines.join("\n");

                onData(`
                    <div class="code-block">
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
                        <pre><code class="language-${currentLang}">
                            ${escapeHtml(codeBuffer)}
                        </code></pre>
                    </div>
                `);

                codeBuffer = "";
            }
            continue;
        }

        if (openBlock) {
            codeBuffer += formatted;
        } else {
            onData(formatSuggestion(formatted));
        }
    }
}

// 🔹 Función principal que une las partes
export async function fetchOllamaResponse(prompt: string, onData: (response: string) => void) {
    try {
        const reader = await fetchOllamaData(prompt);
        if (!reader) throw new Error("No se pudo leer el stream");
        await processOllamaResponse(reader, onData);
    } catch (error) {
        console.error("Error al llamar a Ollama:", error);
        onData('<p style="color: red;">Error al obtener la respuesta de Ollama.</p>');
    }
}
