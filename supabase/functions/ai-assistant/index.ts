
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabasePublishableKey = Deno.env.get("SB_PUBLISHABLE_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    if (!supabaseUrl || !supabasePublishableKey || !geminiApiKey) {
      throw new Error("Required server configuration is missing.");
  }

    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return Response.json(
        { error: "Authentication required." },
        { status: 401, headers: corsHeaders },
      );
    }

    const supabase = createClient(supabaseUrl, supabasePublishableKey, {
      global: {
        headers: { Authorization: authorization },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Invalid or expired session." },
        { status: 401, headers: corsHeaders },
      );
    }

    const body = await req.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return Response.json(
        { error: "Please enter a question." },
        { status: 400, headers: corsHeaders },
      );
    }

    if (message.length > 2000) {
      return Response.json(
        { error: "Questions must be 2000 characters or fewer." },
        { status: 400, headers: corsHeaders },
      );
    }
    
const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("full_name, course, academic_year, career_goal")
  .eq("id", user.id)
  .maybeSingle();

if (profileError) {
  console.error("Profile lookup failed:", profileError.message);

  return Response.json(
    { error: "Unable to load your student profile." },
    { status: 500, headers: corsHeaders },
  );
}

let roadmapContext = "No roadmap data is available.";

if (profile?.academic_year && profile?.career_goal) {
  const { data: modules, error: roadmapError } = await supabase
    .from("roadmap_modules")
    .select("title, description, target_year, module_order, roadmap_topics(title, description, topic_order)")
    .eq("course", profile.course)
    .eq("career_goal", profile.career_goal)
    .eq("target_year", profile.academic_year)
    .order("module_order", { ascending: true });

  if (roadmapError) {
    console.error("Roadmap lookup failed:", roadmapError.message);
  } else if (modules?.length) {
    roadmapContext = JSON.stringify(modules);
  }
}

let projectContext = "No matching projects are available.";

if (profile?.academic_year && profile?.career_goal) {
  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("title, description, difficulty, career_goal, target_year, technologies, project_url")
    .or(`career_goal.eq.${profile.career_goal},career_goal.is.null`)
    .or(`target_year.eq.${profile.academic_year},target_year.is.null`)
    .order("title", { ascending: true });

  if (projectError) {
    console.error("Project lookup failed:", projectError.message);
  } else if (projects?.length) {
    projectContext = JSON.stringify(projects);
  }
}


let internshipContext = "No matching internships are available.";

if (profile?.academic_year && profile?.career_goal) {
  const { data: internships, error: internshipError } = await supabase
    .from("internships")
    .select("title, description, company, location, eligibility_years, career_goals, application_url, deadline, is_verified")
    .contains("eligibility_years", [profile.academic_year])
    .contains("career_goals", [profile.career_goal])
    .order("deadline", { ascending: true })
    .limit(10);

  if (internshipError) {
    console.error(
      "Internship lookup failed:",
      internshipError.message,
    );
  } else if (internships?.length) {
    internshipContext = JSON.stringify(internships);
  }
}



    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          
systemInstruction: {
  parts: [{
    text: `
You are SkillBridge AI, a personalized career guidance assistant for college students.

STUDENT PROFILE:
- Name: ${profile?.full_name || "Student"}
- Course: ${profile?.course || "Not specified"}
- Academic Year: ${profile?.academic_year || "Not specified"}
- Career Goal: ${profile?.career_goal || "Not specified"}


 
AVAILABLE ROADMAP FROM DATABASE:
${roadmapContext}

ROADMAP RULES:
- Prefer topics and modules provided by the database.
- Recommend the next relevant topics for the student's academic year.
- Do not claim a topic exists in the database unless it appears in the provided data.
- If no roadmap data is available, clearly say so and provide general guidance separately.


AVAILABLE PROJECTS FROM DATABASE:
${projectContext}

PROJECT RECOMMENDATION RULES:
- Recommend projects from the provided database records first.
- Consider the student's academic year and career goal.
- Explain the skills needed and why each project is suitable.
- Do not invent project records, URLs, or database details.
- If no matching projects are available, say so clearly.


AVAILABLE INTERNSHIPS FROM DATABASE:
${internshipContext}

INTERNSHIP RECOMMENDATION RULES:
- Recommend internships from the provided database records.
- Consider the student's academic year and career goal.
- Include the internship title, location, deadline, and application URL when available.
- Clearly distinguish verified internships from demo or unverified listings.
- Never invent companies, application URLs, deadlines, or eligibility requirements.
- If no matching internships are available, say so clearly.


GUIDELINES:
1. Personalize advice using the student's profile.
2. Recommend skills and projects suitable for their academic year.
3. Focus on their career goal.
4. Explain concepts in beginner-friendly language.
5. Provide practical, structured next steps.
6. Never claim an internship or job is verified without evidence.
7. Do not invent missing student information.


YEAR-BASED CAREER GUIDANCE:
- Year 1: Prioritize Python, mathematics, problem-solving,
  Git/GitHub, and beginner projects. Do not recommend
  internships as a priority. If asked about internships,
  explain that building fundamentals is the current focus.
- Year 2: Prioritize data structures, core ML concepts,
  data handling, and intermediate projects.
- Year 3: Prioritize advanced ML, deployment, portfolio
  development, and suitable internship preparation.
- Year 4: Prioritize advanced projects, specialization,
  interview preparation, and job or internship applications.
- Always use the student's actual academic year and career goal.
- Recommend internships only when appropriate to the student's
  year and the eligibility requirements in the database.

`,
  }],
},

          contents: [{
            role: "user",
            parts: [{ text: message }],
          }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 800,
          },
        }),
      },
    );

    
if (!response.ok) {
  const errorDetails = await response.text();

  console.error(
    "Gemini request failed:",
    response.status,
    errorDetails,
  );

  return Response.json(
    { error: "The AI provider could not process the request." },
    { status: 502, headers: corsHeaders },
  );
}


    const result = await response.json();
    const reply = result.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();

    if (!reply) {
      return Response.json(
        { error: "The AI assistant returned no response." },
        { status: 502, headers: corsHeaders },
      );
    }

    return Response.json({ reply }, { headers: corsHeaders });
  } catch (error) {
    console.error("AI assistant error:", error);

    return Response.json(
      { error: "Unable to process your request right now." },
      { status: 500, headers: corsHeaders },
    );
  }
});
