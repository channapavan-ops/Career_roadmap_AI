import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { askCareerAssistant } from './services/aiService';
import {
  getMyMentors,
  getMentorResources,
  createMentorResource,
} from './services/mentorService';
import { supabase } from './lib/supabase';
function App() {
  const [question, setQuestion] = useState(
    'Give me a beginner roadmap to become an ML Engineer.'
  );
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
  async function testMentorResources() {
  try {
    const resources = await getMentorResources(1);
    console.log('Mentor resources:', resources);
  } catch (error) {
    console.error('Mentor resources test failed:', error);
  }
  }

  async function checkLoggedInUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Auth check failed:', error.message);
    return;
  }

  console.log('Logged-in user:', data.user?.id, data.user?.email);
}
  async function handleLogin(event) {
  event.preventDefault();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login failed:', error.message);
    alert(`Login failed: ${error.message}`);
    return;
  }

  console.log('Logged in successfully:', data.user.id, data.user.email);
  alert('Login successful');
}

  async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
    return;
  }

  console.log('Logged out successfully');
}

async function testCreateMentorResource() {
  try {
    const resource = await createMentorResource({
      assignmentId: 1,
      title: 'Git and GitHub Basics',
      description: 'A beginner resource for learning Git and GitHub.',
      resourceType: 'link',
      resourceUrl: 'https://docs.github.com/en/get-started',
    });

    console.log('Created mentor resource:', resource);
  } catch (error) {
    console.error(
  'Create resource failed:',
  JSON.stringify(error, null, 2)
);
  }
}


  async function handleAsk(event) {
    event.preventDefault();
    setReply('');
    setLoading(true);

    try {
      const answer = await askCareerAssistant(question);
      setReply(answer);
    } catch (error) {
      setReply(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
  async function testMentors() {
  try {
    const mentors = await getMyMentors();
    console.log('Assigned mentors:', mentors);
  } catch (error) {
    console.error('Mentor test failed:', error);
  }
}
  return (
    <main style={{ maxWidth: 650, margin: '40px auto', padding: 20 }}>
      <h1>SkillBridge AI</h1>
      <h2>AI Career Assistant Test</h2>
      <form onSubmit={handleLogin}>
  <h3>Temporary Login for Testing</h3>

  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    required
  />

  <br /><br />

  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    required
  />

  <br /><br />

  <button type="submit">Login</button>
</form>
<hr />
      <button onClick={testMentors}>
      Test Mentor Backend
      </button><hr></hr>
      <button onClick={testMentorResources}>
      Test Mentor Resources
      </button><hr></hr>
      <button onClick={testCreateMentorResource}>
      Test Create Mentor Resource
      </button><hr></hr>
      <button onClick={checkLoggedInUser}>
      Check Logged-in User
      </button><hr></hr>
      <button onClick={handleLogout}>
      Logout
      </button>
      <form onSubmit={handleAsk}>
        <label htmlFor="question">Ask a career question</label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={4}
          required
          style={{
            display: 'block',
            width: '100%',
            margin: '12px 0',
            padding: 10,
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Getting answer...' : 'Ask AI Assistant'}
        </button>
      </form>

      
{reply && (
  <section style={{ marginTop: 20 }}>
    <h3>AI Response</h3>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {reply.replace(/\\([*`#-])/g, '$1')}
    </ReactMarkdown>
  </section>
)}

    </main>
  );
}

export default App;
