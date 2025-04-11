const config = {
  model: {
    name: String(Bun.env.MODEL_NAME ?? 'llama3.1:8b'),
  },
  urls: {
    ollama: String(Bun.env.OLLAMA_URL || 'http://192.168.10.2:11434'),
  },
  logger: {
    level: String(Bun.env.LOG_LEVEL || 'info'),
  },
};

export default config;
