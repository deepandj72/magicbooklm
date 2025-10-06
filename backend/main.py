import os
import json
from groq import Groq

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

RESEARCHER_PROMPT = """ROLE: You are a meticulous and factual Research Analyst. Your job is to analyze the user's query and extract the key facts and context required to write a comprehensive report. You will not write the report, only the raw data for it.

CRITICAL: Return ONLY a valid JSON object containing an array of key facts. No additional text, no markdown formatting, just the JSON.

Format:
{
  "facts": [
    {"id": 1, "detail": "..."},
    {"id": 2, "detail": "..."}
  ]
}"""

SYNTHESIZER_PROMPT = """ROLE: You are an expert Content Architect and Synthesizer. Your task is to take a raw list of facts and transform them into a coherent, flowing, well-structured Markdown document. Do not invent any new information; strictly use the facts provided in the input.

CRITICAL: Return ONLY the Markdown content. No conversational text, no explanations, just the Markdown document."""

EDITOR_PROMPT = """ROLE: You are a professional Copy Editor and Quality Control Specialist. Your sole job is to take a Markdown draft and correct all grammatical errors, improve clarity, refine the professional tone, and ensure proper Markdown formatting.

CRITICAL: Return ONLY the final, polished Markdown string. Do not add any conversational text or explanation."""

def run_research_agent(topic: str, model: str = "llama-3.1-70b-versatile") -> dict:
    """
    Executes the Research Agent to extract key facts from the topic.
    Returns a dictionary containing an array of facts.
    """
    client = Groq(api_key=GROQ_API_KEY)

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": RESEARCHER_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Analyze this topic and extract key facts for a comprehensive report: {topic}"
                }
            ],
            model=model,
            temperature=0.3,
            max_tokens=2000,
        )

        response_text = chat_completion.choices[0].message.content.strip()

        # Clean potential markdown code blocks
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        research_data = json.loads(response_text.strip())
        return research_data

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Response was: {response_text}")
        return {"facts": [{"id": 1, "detail": "Error parsing research data"}]}
    except Exception as e:
        print(f"Error in research agent: {e}")
        return {"facts": [{"id": 1, "detail": "Error running research agent"}]}


def run_synthesizer_agent(topic: str, raw_data: dict, model: str = "llama-3.1-70b-versatile") -> str:
    """
    Executes the Synthesizer Agent to transform facts into a Markdown report.
    Returns the draft Markdown string.
    """
    client = Groq(api_key=GROQ_API_KEY)

    try:
        facts_text = json.dumps(raw_data, indent=2)

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYNTHESIZER_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Topic: {topic}\n\nFacts to synthesize:\n{facts_text}\n\nCreate a comprehensive, well-structured Markdown report using ONLY these facts."
                }
            ],
            model=model,
            temperature=0.5,
            max_tokens=3000,
        )

        draft_markdown = chat_completion.choices[0].message.content.strip()
        return draft_markdown

    except Exception as e:
        print(f"Error in synthesizer agent: {e}")
        return f"# Error\n\nFailed to synthesize report: {str(e)}"


def run_editor_agent(draft_markdown: str, model: str = "llama-3.1-70b-versatile") -> str:
    """
    Executes the Editor Agent to polish the Markdown draft.
    Returns the final, polished Markdown string.
    """
    client = Groq(api_key=GROQ_API_KEY)

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": EDITOR_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Edit and polish this Markdown document:\n\n{draft_markdown}"
                }
            ],
            model=model,
            temperature=0.3,
            max_tokens=3000,
        )

        final_report = chat_completion.choices[0].message.content.strip()
        return final_report

    except Exception as e:
        print(f"Error in editor agent: {e}")
        return draft_markdown


def generate_report(topic: str, model: str = "llama-3.1-70b-versatile") -> str:
    """
    Main orchestration function that runs all three agents sequentially.
    Returns the final report as a Markdown string.
    """
    print(f"Starting multi-agent research on: {topic}")
    print("=" * 60)

    print("\n[1/3] Running Research Agent...")
    research_data = run_research_agent(topic, model)
    print(f"✓ Extracted {len(research_data.get('facts', []))} facts")

    print("\n[2/3] Running Synthesizer Agent...")
    draft_markdown = run_synthesizer_agent(topic, research_data, model)
    print(f"✓ Generated draft ({len(draft_markdown)} characters)")

    print("\n[3/3] Running Editor Agent...")
    final_report = run_editor_agent(draft_markdown, model)
    print(f"✓ Polished final report ({len(final_report)} characters)")

    print("\n" + "=" * 60)
    print("Multi-agent processing complete!")

    return final_report


if __name__ == "__main__":
    TOPIC = "Compare Groq's LPU architecture to traditional GPU architectures for LLM inference"

    final_report = generate_report(TOPIC)

    with open("final_report.md", "w") as f:
        f.write(final_report)

    print(f"\n✓ Report saved to final_report.md")
