
import { IRTQuestion, Job } from './types';

export const QUESTION_BANK: IRTQuestion[] = [
  // DATA ANALYST QUESTIONS
  { id: 'da1', text: 'You find a significant discrepancy between the marketing dashboard and the sales ledger. The CEO is presenting in 30 minutes. Walk me through your immediate triage process.', beta: 0.85, alpha: 1.2, category: 'Data Integrity' },
  { id: 'da2', text: 'Explain how you would handle a dataset where 30% of the demographic fields are NULL, but you need to segment by region for a critical report.', beta: 0.75, alpha: 1.1, category: 'Data Cleaning' },
  { id: 'da3', text: 'I don’t care about the R-squared value. Tell me, in plain English, why this model predicts customer churn better than our gut feeling.', beta: 0.90, alpha: 1.3, category: 'Communication' },
  
  // STRATEGIST QUESTIONS
  { id: 'st1', text: 'We are launching a B2B SaaS product in a saturated market. Do we price for penetration or skimming? Justify your choice with a specific comparable.', beta: 0.95, alpha: 1.4, category: 'GTM Strategy' },
  { id: 'st2', text: 'Our CAC has doubled in the last quarter. You have 60 seconds to outline three hypotheses and how you would validate them.', beta: 0.85, alpha: 1.2, category: 'Growth Metrics' },
  
  // SALES (AE/AM) QUESTIONS
  { id: 'sa1', text: 'I am a VP of Engineering. I just told you "We are happy with our current solution." Pivot this objection into a discovery opportunity.', beta: 0.80, alpha: 1.1, category: 'Objection Handling' },
  { id: 'sa2', text: 'Walk me through a deal you lost. Not one where the budget disappeared—one where you got outplayed. What happened?', beta: 0.85, alpha: 1.2, category: 'Resilience' },
  { id: 'sa3', text: 'Stop pitching features. Sell me the problem I don’t know I have yet.', beta: 0.90, alpha: 1.3, category: 'Discovery' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Data Analyst',
    company: 'Spotify',
    location: 'Remote / NY',
    salary: '$140k - $180k',
    tags: ['SQL', 'Tableau', 'Python'],
    description: 'Turn petabytes of listening data into actionable product insights.',
    requirements: 'Expert SQL, experience with A/B test significance, and ability to push back on stakeholders.'
  },
  {
    id: 'j2',
    title: 'Enterprise Account Executive',
    company: 'Salesforce',
    location: 'San Francisco / Hybrid',
    salary: '$150k Base + $150k OTE',
    tags: ['SaaS Sales', 'Closing', 'Hunter'],
    description: 'Own the full sales cycle for our Financial Services vertical.',
    requirements: '5+ years closing 6-figure deals. MEDDIC methodology preferred.'
  },
  {
    id: 'j3',
    title: 'Product Strategist',
    company: 'McKinsey Digital',
    location: 'London / Travel',
    salary: '$180k - $250k',
    tags: ['GTM', 'Pricing', 'Consulting'],
    description: 'Define the digital future for Fortune 500 clients.',
    requirements: 'Strong modeling skills and ability to defend frameworks under pressure.'
  }
];

export const WEIGHTS = {
  TECHNICAL: 0.50,
  COHERENCE: 0.25,
  AUTHENTICITY: 0.15,
  SENIORITY: 0.10
};
