import { ProjectItem } from '../types';

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-grade-analyzer',
    title: 'CLI Student Gradebook & Statistical Analyzer',
    shortDescription: 'Build a modular Python CLI tool that parses academic scores, computes variance, generates distributions, and exports CSV reports.',
    fullDescription: 'This foundational engineering project strengthens your command over Python data structures, standard library modules (csv, math, argparse), file exception handling, and writing clean, testable functions with type hinting.',
    difficulty: 'Beginner',
    techStack: ['Python 3', 'Argparse', 'CSV', 'Pytest'],
    requiredSkills: ['Python Fundamentals', 'File I/O', 'Basic Statistics', 'Exception Handling'],
    estimatedHours: 12,
    relatedModuleId: 'ai-y1-m1',
    targetYear: ['1st Year'],
    careerTrack: ['AI Engineer', 'Machine Learning Engineer'],
    learningOutcomes: [
      'Master command-line argument parsing and formatted terminal outputs',
      'Compute mean, median, standard deviation, and interquartile range from scratch',
      'Write automated unit tests using pytest',
      'Handle edge cases like corrupted rows or non-numeric entries gracefully',
    ],
    milestones: [
      { id: 'm1', title: 'Design modular CLI arguments with argparse (--file, --export, --threshold)', completed: true },
      { id: 'm2', title: 'Implement CSV parsing and data validation schema', completed: true },
      { id: 'm3', title: 'Write mathematical calculation functions with full pytest coverage', completed: false },
      { id: 'm4', title: 'Generate formatted terminal summary and export cleaned summary CSV', completed: false },
    ],
    starterGuide: `### Project Architecture Guide
1. Create a virtual environment: \`python -m venv venv && source venv/bin/activate\`
2. Directory structure:
   \`\`\`
   grade_analyzer/
   ├── src/
   │   ├── __init__.py
   │   ├── cli.py
   │   ├── stats.py
   │   └── exporter.py
   ├── tests/
   │   └── test_stats.py
   ├── requirements.txt
   └── README.md
   \`\`\`
3. Use \`dataclasses\` to represent each student record cleanly.`,
    status: 'In Progress',
  },
  {
    id: 'proj-eda-world-health',
    title: 'Exploratory Data Analysis: Global Health & Life Expectancy',
    shortDescription: 'Uncover socioeconomic and immunization drivers of global life expectancy using Pandas, NumPy, and Seaborn heatmaps.',
    fullDescription: 'Perform end-to-end data exploration on the WHO Life Expectancy dataset. You will clean missing records, detect skewed distributions with Box-Cox transforms, correlate GDP/schooling with mortality rates, and communicate statistical findings visually.',
    difficulty: 'Beginner',
    techStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter'],
    requiredSkills: ['Data Wrangling', 'Hypothesis Testing', 'Data Visualization', 'Pandas Indexing'],
    estimatedHours: 18,
    relatedModuleId: 'ai-y1-m2',
    targetYear: ['1st Year'],
    careerTrack: ['AI Engineer', 'Machine Learning Engineer'],
    learningOutcomes: [
      'Diagnose and impute missing data using KNN and median strategies',
      'Identify multicollinearity between feature columns with correlation matrices',
      'Construct informative pairplots, violin plots, and facet grids',
      'Derive actionable policy insights backed by statistical evidence',
    ],
    milestones: [
      { id: 'm1', title: 'Load dataset and conduct missingness and outlier audit', completed: true },
      { id: 'm2', title: 'Apply feature transforms and group-by aggregations by country & status', completed: false },
      { id: 'm3', title: 'Plot correlation heatmaps and bivariate scatter relationships', completed: false },
      { id: 'm4', title: 'Compile an executive summary with 5 key data-driven conclusions', completed: false },
    ],
    starterGuide: `### Starter Code Hint
\`\`\`python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('Life_Expectancy_Data.csv')
print(df.info())
print(df.isnull().sum())
# Clean column names
df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
\`\`\``,
    status: 'Not Started',
  },
  {
    id: 'proj-house-price-prediction',
    title: 'Ames Housing Price Regression with Regularized Models',
    shortDescription: 'Predict real-estate valuations with Ridge, Lasso, and ElasticNet pipelines using Scikit-Learn.',
    fullDescription: 'Tackle the renowned Ames Housing dataset featuring 79 explanatory variables. Build a robust pipeline that prevents data leakage, applies One-Hot Encoding and RobustScaler, and optimizes hyperparameters to predict sale prices with low Root Mean Squared Log Error.',
    difficulty: 'Intermediate',
    techStack: ['Python', 'Scikit-learn', 'Pandas', 'Optuna', 'Matplotlib'],
    requiredSkills: ['Supervised Learning', 'Feature Engineering', 'Regularization (L1/L2)', 'Cross-Validation'],
    estimatedHours: 25,
    relatedModuleId: 'ml-y2-m1',
    targetYear: ['2nd Year'],
    careerTrack: ['Machine Learning Engineer', 'AI Engineer'],
    learningOutcomes: [
      'Construct leak-free ColumnTransformer pipelines in Scikit-learn',
      'Understand bias-variance tradeoff across Ridge, Lasso, and Gradient Boosting',
      'Tune alpha hyperparameters using K-Fold cross validation',
      'Analyze residual plots to verify homoscedasticity assumptions',
    ],
    milestones: [
      { id: 'm1', title: 'Perform log-transformation on target variable (SalePrice)', completed: false },
      { id: 'm2', title: 'Construct Scikit-learn ColumnTransformer for categorical and continuous features', completed: false },
      { id: 'm3', title: 'Train baseline Ridge/Lasso and evaluate RMSLE on 5-fold CV', completed: false },
      { id: 'm4', title: 'Implement LightGBM regressor and plot residual distribution', completed: false },
    ],
    starterGuide: `### Pipeline Blueprint
\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, RobustScaler
from sklearn.linear_model import Ridge

preprocessor = ColumnTransformer(
    transformers=[
        ('num', RobustScaler(), numerical_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
    ]
)
model = Pipeline(steps=[('prep', preprocessor), ('reg', Ridge(alpha=10.0))])
\`\`\``,
    status: 'Not Started',
  },
  {
    id: 'proj-student-performance',
    title: 'Student Academic Performance & Dropout Early-Warning System',
    shortDescription: 'Train an interpretable classifier with Scikit-learn and SHAP to identify at-risk students.',
    fullDescription: 'Develop a predictive classification pipeline that forecasts whether a university student is at risk of academic probation. Utilize SHAP (SHapley Additive exPlanations) to provide transparent feature attributions to academic advisors.',
    difficulty: 'Intermediate',
    techStack: ['Python', 'Scikit-learn', 'SHAP', 'Streamlit', 'Joblib'],
    requiredSkills: ['Classification Metrics', 'SHAP Explainability', 'Model Deployment', 'Streamlit'],
    estimatedHours: 22,
    relatedModuleId: 'ai-y2-m1',
    targetYear: ['2nd Year'],
    careerTrack: ['AI Engineer', 'Machine Learning Engineer'],
    learningOutcomes: [
      'Handle imbalanced class distributions with balanced class weights',
      'Interpret black-box tree models using SHAP waterfall and summary plots',
      'Deploy an interactive Streamlit dashboard allowing counselors to test student profiles',
    ],
    milestones: [
      { id: 'm1', title: 'Explore demographic and academic features; handle collinearity', completed: false },
      { id: 'm2', title: 'Train Random Forest & XGBoost classifiers; evaluate ROC-AUC', completed: false },
      { id: 'm3', title: 'Generate SHAP explanation plots for individual high-risk cases', completed: false },
      { id: 'm4', title: 'Deploy a clean Streamlit app with slider inputs for interactive inference', completed: false },
    ],
    status: 'Not Started',
  },
  {
    id: 'proj-fraud-detection',
    title: 'Credit Card Fraud Anomaly Detection & Metric Tuning',
    shortDescription: 'Handle severe class imbalance with SMOTE, Precision-Recall AUC optimization, and cost-sensitive learning.',
    fullDescription: 'Build an industry-grade anomaly detection pipeline for transaction fraud with 0.17% positive rate. Compare SMOTE, Random Under-Sampling, and Cost-Sensitive XGBoost while optimizing the decision threshold using precision-recall trade-offs.',
    difficulty: 'Intermediate',
    techStack: ['Python', 'Scikit-learn', 'Imbalanced-learn', 'XGBoost', 'Pandas'],
    requiredSkills: ['Precision-Recall Curves', 'SMOTE', 'Cost-Sensitive Learning', 'Threshold Tuning'],
    estimatedHours: 24,
    relatedModuleId: 'ml-y2-m1',
    targetYear: ['2nd Year'],
    careerTrack: ['Machine Learning Engineer', 'AI Engineer'],
    learningOutcomes: [
      'Analyze why accuracy and ROC-AUC fail on severely imbalanced datasets',
      'Synthesize minority samples cleanly with SMOTE and Tomek links',
      'Calibrate classification decision thresholds using financial cost matrices',
    ],
    milestones: [
      { id: 'm1', title: 'Profile transaction distributions and calculate baseline fraud incidence', completed: false },
      { id: 'm2', title: 'Implement SMOTE resampler inside imblearn pipeline without leakage', completed: false },
      { id: 'm3', title: 'Train cost-sensitive XGBoost and plot Precision-Recall curve', completed: false },
      { id: 'm4', title: 'Calculate optimal financial cost decision threshold', completed: false },
    ],
    status: 'Not Started',
  },
  {
    id: 'proj-image-classification',
    title: 'Real-Time Plant Pathology & Leaf Disease Classification',
    shortDescription: 'Transfer learning with PyTorch and MobileNetV2 with interactive Gradio web inference.',
    fullDescription: 'Harness transfer learning to classify 38 classes of healthy and diseased plant leaves from the PlantVillage dataset. Train in PyTorch using data augmentations (RandomCrop, ColorJitter) and export an optimized TorchScript model for low-latency web serving.',
    difficulty: 'Advanced',
    techStack: ['PyTorch', 'Torchvision', 'MobileNetV2', 'Gradio', 'Docker'],
    requiredSkills: ['Convolutional Neural Networks', 'Transfer Learning', 'Data Augmentation', 'PyTorch DataLoader'],
    estimatedHours: 35,
    relatedModuleId: 'ai-y3-m1',
    targetYear: ['3rd Year', '4th Year'],
    careerTrack: ['AI Engineer', 'Machine Learning Engineer'],
    learningOutcomes: [
      'Freeze pre-trained feature extractor weights and fine-tune custom classification head',
      'Apply image augmentations to prevent overfitting on visual artifacts',
      'Generate Grad-CAM heatmaps showing which leaf regions triggered model predictions',
      'Package model into an interactive Gradio interface',
    ],
    milestones: [
      { id: 'm1', title: 'Set up PyTorch Dataset and DataLoader with train/val transforms', completed: false },
      { id: 'm2', title: 'Instantiate torchvision MobileNetV2 and train classifier head with AdamW', completed: false },
      { id: 'm3', title: 'Compute top-1 and top-5 accuracy; generate confusion matrix', completed: false },
      { id: 'm4', title: 'Implement Grad-CAM overlay and create a Gradio web demo', completed: false },
    ],
    status: 'Not Started',
  },
  {
    id: 'proj-rag-document-qa',
    title: 'Enterprise Document Q&A Assistant (RAG Pipeline)',
    shortDescription: 'Retrieval-Augmented Generation system using Gemini API, ChromaDB vector search, and FastAPI.',
    fullDescription: 'Build a production-grade RAG application that allows engineering teams to search and chat with hundreds of technical PDF specifications. Features semantic chunking, vector indexing in Chroma, citation grounding to exact page numbers, and hallucination reduction guardrails.',
    difficulty: 'Advanced',
    techStack: ['Python', 'FastAPI', 'Gemini API', 'ChromaDB', 'LangChain', 'React UI'],
    requiredSkills: ['Vector Embeddings', 'Semantic Search', 'Prompt Engineering', 'FastAPI REST', 'RAG Evaluation'],
    estimatedHours: 40,
    relatedModuleId: 'ai-y3-m1',
    targetYear: ['3rd Year', '4th Year'],
    careerTrack: ['AI Engineer'],
    learningOutcomes: [
      'Implement recursive character chunking with optimal overlap size',
      'Store and query dense vector embeddings with cosine similarity',
      'Enforce citation grounding: each claim must link to source document and page number',
      'Evaluate retrieval faithfulness and answer relevancy with synthetic benchmarks',
    ],
    milestones: [
      { id: 'm1', title: 'Implement PDF parser and text chunking pipeline with metadata extraction', completed: false },
      { id: 'm2', title: 'Generate embeddings using Gemini Embeddings and index in ChromaDB', completed: false },
      { id: 'm3', title: 'Build FastAPI endpoints (/upload, /ask) with streaming response', completed: false },
      { id: 'm4', title: 'Add hallucination guardrail: refuse to answer out-of-context queries', completed: false },
    ],
    status: 'Not Started',
  },
  {
    id: 'proj-semantic-code-search',
    title: 'Semantic Code Search Engine with Vector Embeddings',
    shortDescription: 'Index open-source Python repositories into ChromaDB and execute semantic natural language code search.',
    fullDescription: 'Build an AI-powered code search engine that translates natural language developer queries (e.g. "read parquet file with chunking") into relevant AST-parsed Python functions across a multi-repository codebase.',
    difficulty: 'Advanced',
    techStack: ['Python', 'FastAPI', 'Gemini Embeddings', 'ChromaDB', 'Tree-sitter', 'Docker'],
    requiredSkills: ['AST Parsing', 'Vector Embeddings', 'Semantic Search', 'Docker'],
    estimatedHours: 36,
    relatedModuleId: 'ai-y3-m2',
    targetYear: ['3rd Year'],
    careerTrack: ['AI Engineer', 'Machine Learning Engineer'],
    learningOutcomes: [
      'Parse Python source files into abstract syntax tree (AST) nodes with docstrings',
      'Index code function blocks with vector embeddings and language metadata',
      'Deploy an interactive search service with sub-50ms query response time',
    ],
    milestones: [
      { id: 'm1', title: 'Parse code repository with AST to extract functions and type annotations', completed: false },
      { id: 'm2', title: 'Generate semantic vector representations of function behavior', completed: false },
      { id: 'm3', title: 'Build ChromaDB vector index with cosine similarity search', completed: false },
      { id: 'm4', title: 'Deploy FastAPI query endpoint and containerize with Docker', completed: false },
    ],
    status: 'Not Started',
  },
  {
    id: 'proj-mlops-churn-production',
    title: 'End-to-End MLOps Customer Churn Predictor with Drift Alerts',
    shortDescription: 'Production ML pipeline with automated testing, MLflow tracking, Docker containerization, and Evidently AI drift monitoring.',
    fullDescription: 'The ultimate showcase project for ML Engineering roles. Build a complete lifecycle: data ingestion, automated feature validation with Great Expectations, model tracking in MLflow, containerized serving on FastAPI, and an automated drift detection cron job that fires Slack/webhook alerts when incoming data shifts.',
    difficulty: 'Capstone',
    techStack: ['Python', 'FastAPI', 'MLflow', 'Docker', 'Evidently AI', 'GitHub Actions', 'PostgreSQL'],
    requiredSkills: ['MLOps Lifecycle', 'Docker Containerization', 'Data Drift Detection', 'CI/CD Pipelines'],
    estimatedHours: 45,
    relatedModuleId: 'ml-y4-m1',
    targetYear: ['4th Year'],
    careerTrack: ['Machine Learning Engineer'],
    learningOutcomes: [
      'Architect an enterprise MLOps lifecycle from training to production monitoring',
      'Implement automated data validation before inference using Great Expectations',
      'Monitor Kolmogorov-Smirnov statistical drift in live prediction traffic',
      'Configure GitHub Actions CI/CD to build, test, and containerize inference services',
    ],
    milestones: [
      { id: 'm1', title: 'Build automated training pipeline with MLflow parameters and artifact logging', completed: false },
      { id: 'm2', title: 'Package model into Dockerized FastAPI container with <20ms p95 latency', completed: false },
      { id: 'm3', title: 'Implement Evidently AI dashboard tracking drift across 15 features', completed: false },
      { id: 'm4', title: 'Set up GitHub Actions workflow verifying unit tests and Docker image build', completed: false },
    ],
    status: 'Not Started',
  },
];
