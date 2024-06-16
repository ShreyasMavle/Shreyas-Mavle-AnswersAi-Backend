const { config } = require('dotenv');
config();
const { HumanMessage } = require('@langchain/core/messages');
const { ChatAnthropic } = require('@langchain/anthropic');

const model = new ChatAnthropic({
	model: 'claude-3-sonnet-20240229',
	temperature: 0,
});

module.exports = async function call_chat_model(question) {
	const resp = await model.invoke([new HumanMessage({ content: question })]);
	return resp.content;
};
