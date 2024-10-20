
from uagents import Agent, Context
from typing import Dict, Any
from pydantic import BaseModel
import warnings
import urllib3



AI_AGENT_ADDRESS = "agent1qvk7q2av3e2y5gf5s90nfzkc8a48q3wdqeevwrtgqfdl0k78rspd6f2l4dx"



urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Define the models for Text Prompt and Text Response
class TextPrompt(BaseModel):
    text: str


class TextResponse(BaseModel):
    text: str


# Initialize the agent
agent = Agent()

# Claude.ai agent address (Replace with the actual agent address if different)

# Define the prompts you want to send to Claude.ai agent
prompts = [
    "How is the weather in London today?",
    "Compare the inflation rates of the past years in various European countries.",
]


# Event triggered on agent startup to send messages to Claude.ai agent
@agent.on_event("startup")
async def send_message(ctx: Context):
    for prompt in prompts:
        await ctx.send(AI_AGENT_ADDRESS, TextPrompt(text=prompt))
        ctx.logger.info(f"[Sent prompt to AI agent]: {prompt}")

# Handle the response from Claude.ai agent
@agent.on_message(TextResponse)
async def handle_response(ctx: Context, sender: str, msg: TextResponse):
    ctx.logger.info(f"[Received response from ...{sender[-8:]}]:")
    ctx.logger.info(msg.text)


if __name__ == "__main__":
    # Run the agent
    agent.run()