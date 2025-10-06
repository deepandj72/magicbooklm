from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from main import generate_report, run_research_agent, run_synthesizer_agent, run_editor_agent

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/api/generate-report', methods=['POST'])
def api_generate_report():
    data = request.json
    topic = data.get('topic', '')
    model = data.get('model', 'llama-3.1-70b-versatile')

    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    try:
        final_report = generate_report(topic, model)
        return jsonify({
            "success": True,
            "report": final_report
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/chat', methods=['POST'])
def api_chat():
    data = request.json
    sources = data.get('sources', [])
    query = data.get('query', '')
    model = data.get('model', 'llama-3.1-70b-versatile')

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        from groq import Groq
        client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

        sources_text = "\n\n".join([f"Source {i+1} ({s.get('title', 'Untitled')}):\n{s.get('content', '')}"
                                     for i, s in enumerate(sources)])

        system_prompt = f"""You are an AI assistant helping users understand their sources.
Answer questions based on the following sources:

{sources_text}

Provide accurate, helpful answers based on the information in the sources."""

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            model=model,
            temperature=0.5,
            max_tokens=2000,
        )

        response = chat_completion.choices[0].message.content.strip()

        return jsonify({
            "success": True,
            "response": response
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
