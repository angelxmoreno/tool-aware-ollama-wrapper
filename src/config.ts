const config = {
    model: {
        name: String(Bun.env.MODEL_NAME ?? "tinyllama:latest")
    },
    urls: {
        ollama: String(Bun.env.OLLAMA_URL || "http://localhost:11434"),
    },
    retry: {
        intervalMs: Number(Bun.env.INTERVAL_MS ?? 1000),
        timeoutMs: Number(Bun.env.TIMEOUT_MS ?? 30000)
    },
    logger: {
        level: String(Bun.env.LOG_LEVEL || "info")
    },
}

export default config;