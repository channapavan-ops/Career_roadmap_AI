import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// Gemini AI Chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], studentContext = {} } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!aiClient) {
      // Deterministic demo mode response when API key is not yet set
      const demoReply = generateDemoAiResponse(message, studentContext);
      res.json({
        reply: demoReply,
        isDemo: true,
        note: 'Running in demo mode. Add GEMINI_API_KEY to your environment for live model responses.',
      });
      return;
    }

    const {
      name = 'Student',
      year = '2nd Year',
      careerTrack = 'Machine Learning Engineer',
      currentModule = 'Core Machine Learning & Algorithms',
      completedTopicsCount = 4,
      totalTopicsCount = 18,
    } = studentContext;

    const systemInstruction = `You are the SkillBridge AI Career Assistant, a warm, highly knowledgeable, and encouraging engineering mentor specializing in Artificial Intelligence and Machine Learning education.

Current Student Profile:
- Name: ${name}
- Academic Year: ${year}
- Target Career Track: ${careerTrack}
- Current Learning Module: ${currentModule}
- Roadmap Progress: ${completedTopicsCount} of ${totalTopicsCount} topics completed

Guidelines:
1. Provide clear, structured, and practical advice tailored to engineering students.
2. When explaining technical concepts (e.g., neural networks, loss functions, backprop, embeddings, RAG), use intuitive analogies followed by concise technical precision and code snippets in Python if relevant.
3. Keep the advice actionable: suggest concrete next steps, learning modules, or starter project milestones.
4. If asked about the difference between AI Engineer and ML Engineer:
   - ML Engineers focus heavily on data modeling, feature engineering, mathematical optimization, training pipelines, and MLOps deployment.
   - AI Engineers focus more on integrating foundation models, prompt engineering, RAG architectures, LLM agents, and API-driven application development.
5. Use markdown formatting with clear headings, bullet points, and code blocks where appropriate.`;

    // Construct contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add recent history if provided
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (turn.role === 'user' || turn.role === 'model') {
          contents.push({
            role: turn.role,
            parts: [{ text: String(turn.text || turn.content || '') }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I apologize, but I could not formulate a response at this moment. Please try again.';

    res.json({
      reply,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    // Graceful fallback response
    res.status(500).json({
      error: error.message || 'Failed to generate AI response',
      fallback: 'We encountered an issue connecting to the AI model. Please try again in a moment.',
    });
  }
});

function generateDemoAiResponse(message: string, context: any): string {
  const q = message.toLowerCase();
  const track = context?.careerTrack || 'AI/ML Engineering';
  const year = context?.year || '2nd Year';

  if (q.includes('difference') || q.includes('ai engineer') || q.includes('ml engineer')) {
    return `### AI Engineer vs. Machine Learning Engineer: Key Distinctions

Great question! In modern tech, these two roles have distinct specializations:

| Dimension | Machine Learning Engineer | AI Engineer |
| :--- | :--- | :--- |
| **Primary Focus** | Developing, training, evaluating & deploying custom statistical & deep learning models | Building software products powered by Foundation Models, LLMs & APIs |
| **Core Tech Stack** | Scikit-learn, PyTorch, TensorFlow, MLflow, Docker, CUDA | LangChain, LlamaIndex, Vector DBs (Chroma/Pinecone), FastAPI, Gemini API |
| **Mathematics Depth** | Heavy: Linear algebra, calculus, probability distributions, gradient descent | Moderate: Vector embeddings, token statistics, retrieval ranking |
| **Key Deliverable** | End-to-end trained models, inference pipelines & monitoring | RAG systems, AI agents, production LLM apps & evaluation harnesses |

**Recommendation for your ${year} journey:**
Start with ML foundations (understanding how models learn), then branch into AI Engineering tools to build real-world user-facing applications!`;
  }

  if (q.includes('what should i learn next') || q.includes('next topic') || q.includes('next')) {
    return `### Next Recommended Step for ${track} (${year})

Based on your current roadmap module: **${context?.currentModule || 'Machine Learning Foundations'}**:

1. **Immediate Focus**: Complete your milestone on **Supervised Learning & Evaluation Metrics** (Precision, Recall, ROC-AUC, F1-score).
2. **Hands-on Exercise**: Train a Scikit-Learn Random Forest and compare its confusion matrix against a Logistic Regression baseline on a Kaggle tabular dataset.
3. **Curated Next Resource**: Review StatQuest's intuitive breakdown of Decision Trees & Cross-Validation.

Would you like me to walk through an example of calculating precision vs recall, or suggest a starter notebook?`;
  }

  if (q.includes('project') || q.includes('beginner project') || q.includes('idea')) {
    return `### 3 High-Impact Project Ideas for ${year} (${track})

1. **Student Grade & Performance Predictor (Tabular ML)**
   - *Tech:* Python, Pandas, Scikit-learn, Streamlit
   - *Concept:* Train a regression model with feature importance to identify which study habits correlate most with exam scores.

2. **Personal Document Q&A Assistant (RAG)**
   - *Tech:* Python, Gemini API, ChromaDB, FastAPI
   - *Concept:* Upload lecture PDF notes and query them with semantic retrieval and cited source pages.

3. **Computer Vision Leaf Disease Detector**
   - *Tech:* PyTorch, MobileNetV2, Gradio
   - *Concept:* Fine-tune a lightweight pre-trained CNN on plant leaf images with data augmentation.

Which one matches your current interest? I can break down the exact architecture and folder layout!`;
  }

  return `### Hello from SkillBridge AI Assistant!

I'm your dedicated career companion for **${track}** (${year}). 

You asked: *"${message}"*

Here is my key guidance:
- Focus on building strong algorithmic foundations before rushing into complex frameworks.
- Practice by completing one small project per roadmap milestone—portfolio evidence always beats certificates in technical interviews.
- Remember to check in with your personal human mentor for project code reviews and personalized resource recommendations.

Feel free to ask me to explain any roadmap topic (like *Gradient Descent*, *Backpropagation*, or *Vector Search*), review your project architecture, or prepare interview questions!`;
}

// Vite integration: mount in dev mode, or serve static dist in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge AI server running at http://localhost:${PORT}`);
  });
}

startServer();
