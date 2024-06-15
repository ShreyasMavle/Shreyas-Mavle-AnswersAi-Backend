import { config } from 'dotenv';
config();
import { HumanMessage } from '@langchain/core/messages';
import { ChatAnthropic } from '@langchain/anthropic';

const model = new ChatAnthropic({
	model: 'claude-3-sonnet-20240229',
	temperature: 0,
});

const resp = await model.invoke([
	new HumanMessage({ content: "Hi! I'm Bob!" }),
]);
console.log(resp.content);
