import  {Ollama} from 'ollama'
import config from "./config";

export const ollamaClient = new Ollama({ host: config.urls.ollama });