/* ------------------------------------------------------------------
   Central content store — personalized for Osheen Bhardwaj.
   Edit this file to update the portfolio content.
------------------------------------------------------------------- */
const SITE = {
  name: "Osheen Bhardwaj",
  initials: "OB",
  role: "Full-Stack Developer | AI/ML Engineer",
  tagline: "Building full-stack applications and exploring applied AI/ML — from backend systems and APIs to deep-learning robustness evaluation.",
  location: "India",
  email: "osheenbhardwaj9@gmail.com",
  github: "https://github.com/osheen16",
  githubHandle: "github.com/osheen16",
  avatar: "assets/profile.jpg",
};

const SOCIALS = [
  { key: "email", label: "Email", handle: "osheenbhardwaj9@gmail.com", href: "mailto:osheenbhardwaj9@gmail.com" },
  { key: "github", label: "GitHub", handle: "github.com/osheen16", href: "https://github.com/osheen16" },
  { key: "linkedin", label: "LinkedIn", handle: "linkedin.com/in/osheen-bhardwaj", href: "https://www.linkedin.com/in/osheen-bhardwaj" },
];

const CURRENT_ROLE = {
  title: "Freelance Technical Developer",
  org: "BrainyDesk LLP",
  period: "May 2026 — Present",
  location: "Remote",
  blurb: "Building practical software and ML solutions at BrainyDesk LLP — including database-backed applications, IoMT traffic-classification workflows and Tableau dashboards for data-driven analysis.",
};

const EDUCATION = [
  { degree: "B.Tech in Computer Science Engineering", school: "Banasthali Vidyapith, Rajasthan", period: "2022 — 2026", location: "", detail: "CGPA: 7.5 / 10" },
  { degree: "Class XII", school: "Banasthali Vidyapith (Banasthali Board)", period: "2020 — 2022", location: "", detail: "90.6 percent" },
  { degree: "Class X", school: "Great Mission Public School, Nainital (CBSE)", period: "2019 — 2020", location: "", detail: "86.6 percent" },
];

const ACHIEVEMENTS = [
  { stat: "DRDO", label: "AI/ML internship in deep learning robustness" },
  { stat: "Full Stack", label: "Application development with Java, Spring Boot and MySQL" },
  { stat: "AI / ML", label: "Experience with model evaluation and traffic classification" },
  { stat: "2026", label: "B.Tech in Computer Science Engineering" },
];

const EXPERIENCE = [
  {
    title: "Freelance Technical Developer — Software & ML Solutions",
    org: "BrainyDesk LLP",
    period: "May 2026 — Present",
    location: "Remote",
    tags: ["Python", "MySQL", "Machine Learning", "Tableau", "Networking"],
    points: [
      "Developed a Python Tkinter and MySQL Car Dealer Management System covering customer, vehicle, sales, service and database workflows.",
      "Built an IoMT traffic classification pipeline using Pandas and machine-learning tools to distinguish attack traffic from benign traffic.",
      "Created Tableau worksheets and dashboards for trend analysis, data visualization and business intelligence reporting.",
      "Designed a multi-department network architecture in Cisco Packet Tracer, including IP addressing, routing, switching and connectivity.",
      "Performed controlled malware-analysis exercises using tools including VirtualBox, VirusTotal, Hybrid Analysis and PEStudio.",
      "Worked on additional database and data-analysis projects, including flight-booking system design and crop-yield analysis."
    ],
  },
  {
    title: "AI/ML Intern — Deep Learning Systems",
    org: "Defence Research and Development Organisation (DRDO)",
    period: "Jul 2025 — Nov 2025",
    location: "Delhi, India",
    tags: ["PyTorch", "TensorFlow", "ART", "AIX360", "AIF360"],
    points: [
      "Contributed to a reliability and robustness testing toolkit for deep learning systems inspired by IBM's Adversarial Robustness Toolbox (ART).",
      "Worked on testing workflows for tabular and image data and explored adversarial attacks and noise-injection scenarios.",
      "Explored tools and frameworks for robustness, explainability and fairness assessment, including ART, AIX360 and AIF360.",
      "Used PyTorch and TensorFlow for model experimentation and reliability evaluation.",
      "Contributed to technical documentation and research on adversarial machine learning for defence AI applications."
    ],
  },
];

const PROJECTS = [
  {
    title: "DRDO Deep Learning Reliability & Robustness Testing Toolkit",
    period: "Jul 2025 — Nov 2025",
    context: "DRDO Internship · AI/ML Research",
    description: "Contributed to a toolkit inspired by IBM's Adversarial Robustness Toolbox (ART) to evaluate deep-learning model behaviour under robustness-testing scenarios. The work considered both tabular and image data, adversarial attacks and noise injection, with related exploration of explainability and fairness tools.",
    tags: ["PyTorch", "TensorFlow", "ART", "AIX360", "AIF360", "Adversarial ML", "Tabular & Image Data"],
    pipeline: [
      { title: "Data input", detail: "Work with tabular or image datasets." },
      { title: "Prepare a baseline", detail: "Prepare the data and observe model behaviour on clean inputs." },
      { title: "Model setup", detail: "Use a compatible deep-learning model and framework for evaluation." },
      { title: "Robustness tests", detail: "Explore adversarial attack and noise-injection test cases." },
      { title: "Compare behaviour", detail: "Compare model responses on clean and perturbed inputs to study robustness." },
      { title: "Analysis and documentation", detail: "Document observations and explore related explainability and fairness assessment tools." }
    ],
    href: "#"
  },
  {
    title: "Rezumio — Resume Building Website",
    period: "Jan 2025 — May 2025",
    context: "Featured Project · Full-Stack Development",
    description: "A full-stack resume-building platform focused on turning profile details into polished, customizable resumes. I developed the Spring Boot backend, REST APIs and MySQL persistence, and integrated Google and LinkedIn OAuth2 authentication. The platform includes editable templates, dynamic resume generation and a real-time preview, with a decoupled frontend and backend.",
    tags: ["Java", "Spring Boot", "MySQL", "REST APIs", "OAuth2", "HTML/CSS/JavaScript"],
    href: "#",
  },
  {
    title: "E-commerce AI Chatbot",
    period: "Jul 2024 — Dec 2024",
    context: "Conversational AI · Project",
    description: "An e-commerce support chatbot built with Rasa NLP, React and Flask. It uses intent classification, entity extraction and dialogue management, with API endpoints for order lookup and tracking.",
    tags: ["Python", "Rasa NLP", "React", "Flask", "JavaScript"],
    href: "#",
  },
  {
    title: "IoMT Traffic Classification Pipeline",
    period: "2026",
    context: "Machine Learning · Network Security",
    description: "A machine-learning workflow for analysing IoMT network traffic and classifying flows as benign or attack traffic, using data preparation and feature processing with models including Scikit-learn approaches and XGBoost/ANN experiments.",
    tags: ["Python", "Pandas", "Scikit-learn", "XGBoost", "ANN", "Cybersecurity"],
    href: "#",
  },

];

const PUBLICATIONS = [];

const SKILLS = {
  "Languages": ["Java", "Python", "C++", "JavaScript", "HTML", "CSS"],
  "Development": ["Spring Boot", "React", "Flask", "Rasa NLP", "REST APIs", "OAuth2"],
  "AI / ML & Data": ["PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "XGBoost", "ANN", "Tableau", "Power BI", "Advanced Excel"],
  "Databases & Tools": ["MySQL", "MongoDB", "Git", "GitHub", "VS Code", "Postman", "Cisco Packet Tracer", "VirtualBox"],
};

const EXTRAS = [
  { label: "Google Analytics Certification", detail: "Skillshop" },
  { label: "Oracle AI Agentic Foundations Associate", detail: "Certification" },
];

const RESUME_FILES = [
  { id: "summary", name: "summary.md", type: "md", render: "prose", content: "Computer Science Engineer with experience in AI/ML research and full-stack development. Worked on deep learning robustness testing at DRDO and developed software projects using Java, Spring Boot, React, Python and MySQL. Interested in software engineering, applied AI/ML and data analytics." },
  { id: "experience", name: "experience.js", type: "js", render: "experience", entries: EXPERIENCE.map((e) => ({ title: e.title, org: e.org, period: e.period, location: e.location, points: e.points })) },
  { id: "education", name: "education.yaml", type: "yaml", render: "education", entries: EDUCATION.map((e) => ({ degree: e.degree, result: e.detail, school: e.school, years: e.period })) },
  { id: "projects", name: "projects.js", type: "js", render: "experience", entries: PROJECTS.map((p) => ({ title: p.title, org: p.context, period: p.period, location: "", points: [p.description, "Technologies: " + p.tags.join(", ")] })) },
  { id: "skills", name: "skills.json", type: "json", render: "chips", items: Object.values(SKILLS).flat() },
  { id: "certifications", name: "certifications.md", type: "md", render: "experience", entries: [{ title: "Google Analytics Certification", org: "Skillshop", period: "", location: "", points: [] }, { title: "Oracle AI Agentic Foundations Associate", org: "Oracle", period: "", location: "", points: [] }] },
];
