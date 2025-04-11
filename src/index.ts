import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { ollamaClient } from './ollamaClient';
import { get_employee_by_name, get_employee_by_email, get_employee_manager } from './tools';
import logger from './logger';
import config from './config';
import { AppDataSource } from './data-source';

const rl = readline.createInterface({ input, output });
const systemPrompt = `
You are an AI assistant that can answer questions naturally or use tools when needed.

You have access to the following tools:

- get_employee_by_name(name: string)
- get_employee_by_email(email: string)
- get_employee_manager(employeeId: number)

Only return a tool call if necessary to answer the question. If you can answer using what you already know, do so. 

If you use a tool, return exactly one line in this format:
get_employee_by_name("Jane Doe")

Do not return explanations or multiple lines.
`;
async function main() {
  logger.info(`🧠 Chat assistant started using model: ${config.model.name}`);

  const history = [{ role: 'system', content: systemPrompt }];

  while (true) {
    const userInput = await rl.question('You: ');
    if (userInput.toLowerCase() === 'exit') break;

    history.push({ role: 'user', content: userInput });

    const response = await ollamaClient.chat({
      model: config.model.name,
      messages: history,
    });

    const content = response.message.content.trim();
    logger.info('🤖 Raw response: ' + content);

    const toolMatch = content.match(/(\w+)\((.*)\)/);
    if (toolMatch) {
      const [, toolName, rawArg] = toolMatch;
      const arg = rawArg.replace(/['"`]/g, '').trim();

      let toolResult = null;

      switch (toolName) {
        case 'get_employee_by_name':
          toolResult = await get_employee_by_name(arg);
          break;
        case 'get_employee_by_email':
          toolResult = await get_employee_by_email(arg);
          break;
        case 'get_employee_manager':
          toolResult = await get_employee_manager(parseInt(arg, 10));
          break;
      }

      const resultJson = JSON.stringify(toolResult, null, 2);
      history.push({ role: 'assistant', content }); // The tool call
      history.push({
        role: 'user',
        content: `The result of calling ${toolName} was:\n\n${resultJson}\n\nPlease use this result to answer the original question.`,
      });

      const followUp = await ollamaClient.chat({
        model: config.model.name,
        messages: history,
      });

      const finalReply = followUp.message.content.trim();
      logger.info('🤖 Final response: ' + finalReply);
      console.log('🤖', finalReply);
      history.push({ role: 'assistant', content: finalReply });
    } else {
      console.log('🤖', content);
      history.push({ role: 'assistant', content });
    }
  }

  rl.close();
}

(async () => {
  await AppDataSource.initialize();
  await main();
})();
