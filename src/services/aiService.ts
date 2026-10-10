import { ChatMessage, StudentPreferences } from '../types';

export interface AiChatResponse {
  reply: string;
  isDemo?: boolean;
  error?: string;
}

export const aiService = {
  async sendMessage(
    message: string,
    history: ChatMessage[],
    studentContext?: {
      name: string;
      year: string;
      careerTrack: string;
      currentModule: string;
      completedTopicsCount: number;
      totalTopicsCount: number;
    }
  ): Promise<AiChatResponse> {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: history.map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            text: h.content,
          })),
          studentContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        reply: data.reply || 'I processed your question, but could not produce a response.',
        isDemo: data.isDemo ?? false,
      };
    } catch (err: any) {
      console.warn('Backend Gemini API call fallback triggered:', err);
      return {
        reply: this.generateClientFallbackReply(message, studentContext),
        isDemo: true,
      };
    }
  },

  generateClientFallbackReply(message: string, context?: any): string {
    const q = message.toLowerCase();
    const track = context?.careerTrack || 'AI / ML';
    const year = context?.year || '2nd Year';

    if (q.includes('difference') || q.includes('vs') || q.includes('ml engineer')) {
      return `### AI Engineer vs. Machine Learning Engineer

Here is the essential breakdown for your **${year}** career planning:

1. **Machine Learning Engineer**
   - **Focus:** Developing, training, evaluating, and fine-tuning mathematical models from raw datasets.
   - **Stack:** PyTorch, Scikit-learn, XGBoost, MLflow, CUDA, Ray, Docker.
   - **Core Skills:** Linear algebra, calculus, feature engineering, loss optimization, MLOps telemetry.

2. **AI Engineer**
   - **Focus:** Integrating foundation models (LLMs, vision models) into resilient, user-facing software.
   - **Stack:** LangChain, LlamaIndex, Vector Databases (Pinecone/Chroma), Gemini API, FastAPI.
   - **Core Skills:** Prompt engineering, Retrieval-Augmented Generation (RAG), AI agents, latency caching.

*Recommendation:* Build solid ML fundamentals first so you understand how embeddings work, then transition into AI Engineering frameworks!`;
    }

    if (q.includes('learn next') || q.includes('what should i') || q.includes('next topic')) {
      return `### Next Recommended Step

Based on your progress in **${track}**:
- **Target Module:** ${context?.currentModule || 'Data Science & Classical ML'}
- **Action Item:** Complete your practical exercise on **Cross-Validation and Confusion Matrix Analysis**.
- **Exercise:** Build a Scikit-learn pipeline with \`GridSearchCV\` and plot precision-recall curves on an imbalanced classification dataset.

Would you like starter code for this pipeline or recommended tutorial videos?`;
    }

    return `### SkillBridge AI Guidance for ${track} (${year})

Regarding: *"${message}"*

1. **Conceptual Understanding:** Make sure you can write the loss function and explain why gradient descent converges for this topic.
2. **Implementation:** Avoid merely calling high-level libraries until you have written a toy version from scratch.
3. **Portfolio Impact:** Document this concept in your GitHub project README with an illustrative visual.

Feel free to ask me to explain specific algorithms, generate practice quiz questions, or review your project ideas!`;
  },
};
