
import { IRTQuestion, Job } from './types';

export const QUESTION_BANK: IRTQuestion[] = [
  { id: '1', text: 'Explain the internal implementation of a Distributed Locking mechanism using Redis. What happens during a network partition?', beta: 0.85, alpha: 1.2, category: 'System Design' },
  { id: '2', text: 'Compare and contrast the performance characteristics of B-Trees vs. LSM-Trees in high-write-throughput environments.', beta: 0.75, alpha: 1.1, category: 'Algorithms' },
  { id: '3', text: 'How would you mitigate a cascading failure in a microservices architecture that utilizes asynchronous event sourcing?', beta: 0.9, alpha: 1.3, category: 'System Design' },
  { id: '4', text: 'Describe the memory layout of a high-performance concurrent garbage collector. Focus on how it handles write barriers.', beta: 0.95, alpha: 1.4, category: 'Concurrency' },
  { id: '5', text: 'Explain the trade-offs of using GraphQL in a high-traffic public API compared to REST with HATEOAS.', beta: 0.65, alpha: 0.9, category: 'System Design' },
  { id: '6', text: 'Discuss the security implications of JWT storage in modern browser environments. How do you prevent CSRF/XSS specifically?', beta: 0.7, alpha: 1.0, category: 'Security' },
  { id: '7', text: 'We just lost our primary budget for this quarter. Why should we still consider moving forward with your solution now instead of next year?', beta: 0.80, alpha: 1.1, category: 'Sales' },
  { id: '8', text: 'Your competitor is offering a 40% discount and a faster implementation timeline. How do you defend our premium positioning without trashing them?', beta: 0.85, alpha: 1.2, category: 'Sales' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Distributed Systems Engineer',
    company: 'Neuralink',
    location: 'Remote / San Francisco',
    salary: '$220k - $310k',
    tags: ['Rust', 'Distributed Systems', 'Low Latency'],
    description: 'Lead the architecture of our real-time telemetry pipelines.',
    requirements: 'Experience with consensus protocols (Raft/Paxos) and lock-free data structures.'
  },
  {
    id: 'j4',
    title: 'Strategic Account Executive',
    company: 'Stripe',
    location: 'New York / Hybrid',
    salary: '$150k + $150k OTE',
    tags: ['Sales', 'FinTech', 'Negotiation'],
    description: 'Own high-stakes relationships with global enterprise partners.',
    requirements: 'Proven track record of $2M+ ACV deals and exceptional objection handling.'
  },
  {
    id: 'j2',
    title: 'Founding Infrastructure Lead',
    company: 'Vera AI',
    location: 'London / Hybrid',
    salary: '$180k - $250k + Equity',
    tags: ['Go', 'Kubernetes', 'Cloud Native'],
    description: 'Build the global backbone for verified career identity.',
    requirements: 'Strong background in cloud architecture and zero-trust security.'
  }
];

export const WEIGHTS = {
  TECHNICAL: 0.50,
  COHERENCE: 0.25,
  AUTHENTICITY: 0.15,
  SENIORITY: 0.10
};
