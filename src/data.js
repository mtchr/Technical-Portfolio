export const profile = {
  name: "Matthew Christensen",
  github: "https://github.com/mtchr",
  linkedin: "https://www.linkedin.com/in/matthew-christensen35789/",
  email: "matt.chr63@gmail.com",
  role: "Full-stack developer & Information Systems student",
  intro:
    "I turn real-world problems into thoughtful digital experiences. Studying Information Systems at BYU. Building with people in mind.",
  skills: [
    "Python",
    "Django",
    "PostgreSQL",
    "SQL",
    "HTML / CSS",
    "JavaScript",
    "Excel / VBA",
    "Tableau",
    "Figma",
  ],
};
export const projects = [
  {
    id: "patrol-center",
    name: "Patrol Center",
    eyebrow: "SYSTEMS THAT MAKE A DIFFERENCE",
    subtitle: "A clearer view. A smarter patrol.",
    category: "Full-stack development",
    context: "Solo project · BYU Traffic & Security",
    description:
      "A vehicle-tracking and lot-auditing dashboard built to give traffic officers a shared picture of campus. GPS data, geofencing, and a live dashboard connect field activity to better decisions.",
    detail:
      "Developed and deployed during a 70-hour solo project. My résumé reports 20 ticketing hours saved each week.",
    tags: ["Python", "Django", "PostgreSQL", "JavaScript"],
    metric: "20 hours",
    metricLabel: "of ticketing time saved per week",
    repo: "Traffic-Vehicle-App-",
    image: "patrol.svg",
    imageLabel: "Architecture illustration",
    imageAlt:
      "Diagram showing GPS telemetry flowing through Django and PostgreSQL to a live patrol dashboard",
    color: "#9ddfd6",
    point: [5, 1, -44],
  },
  {
    id: "shopwyse",
    name: "ShopWyse",
    eyebrow: "EVERYDAY PROBLEMS. THOUGHTFUL SOLUTIONS.",
    subtitle: "A little wiser, before the checkout.",
    category: "Product design & development",
    context: "Team project · Grocery comparison prototype",
    description:
      "A grocery-planning prototype that compares nearby store totals, saves shopping lists, and helps people plan meals. Real Kroger pricing is combined with estimates for other stores.",
    detail:
      "Built as a team prototype for user interviews, with Supabase data and a Kroger API integration through an Edge Function.",
    tags: ["JavaScript", "Supabase", "PostgreSQL", "Kroger API"],
    metric: "One list.",
    metricLabel: "A clearer picture of grocery costs.",
    repo: "Shopwyse_Grocery_App",
    image: "shopwyse.jpg",
    imageLabel: "Interface preview",
    imageAlt:
      "ShopWyse grocery comparison interface showing its search and planning experience",
    color: "#dec69b",
    point: [-6, -2, -92],
  },
  {
    id: "cougarcalc",
    name: "CougarCalc",
    eyebrow: "SMALL INTERFACE. DEEPER SYSTEMS.",
    subtitle: "More than the sum of its parts.",
    category: "Backend & cloud infrastructure",
    context: "Coursework · IS 404",
    description:
      "A calculator with browser-specific calculation history in PostgreSQL. The project explores Express APIs, database reliability, and a deployment architecture for AWS Elastic Beanstalk and RDS.",
    detail:
      "Calculations remain available when the database is offline, with clear feedback when history cannot be saved.",
    tags: ["Node.js", "Express", "PostgreSQL", "AWS"],
    metric: "Built to",
    metricLabel: "keep calculating through database outages.",
    repo: "is404-cougarcalc",
    image: "cougarcalc.jpg",
    imageLabel: "Interface preview",
    imageAlt:
      "The CougarCalc calculator interface with keypad and history controls",
    color: "#bfb4e7",
    point: [7, 2, -142],
  },
  {
    id: "northwest-aquarium",
    name: "Northwest Aquarium",
    eyebrow: "A SMOOTHER PATH TO DISCOVERY",
    subtitle: "An easier way into the deep.",
    category: "Frontend & interaction design",
    context: "Interface prototype · Ticket reservations",
    description:
      "An aquarium admission prototype that guides visitors through entry times, age-based tickets, and a reservation summary. A playful interface makes a multi-step form easier to follow.",
    detail:
      "A frontend exploration of booking flows, responsive design, and clear validation. Presented as an interface prototype.",
    tags: ["HTML", "JavaScript", "Tailwind CSS", "Responsive design"],
    metric: "Step by step.",
    metricLabel: "From choosing a time to planning a visit.",
    repo: "Aquarium-App",
    image: "aquarium.jpg",
    imageLabel: "Interface preview",
    imageAlt:
      "Northwest Aquarium visitor admission interface with reservation steps",
    color: "#9fc8e6",
    point: [-3, -1, -194],
  },
];
