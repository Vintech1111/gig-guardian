export const PLATFORMS = [
  { id: 'amazon-flex', name: 'Amazon Flex', icon: '📦' },
  { id: 'spark-delivery', name: 'Spark Delivery', icon: '⚡' },
  { id: 'uber', name: 'Uber', icon: '🚗' },
  { id: 'uber-eats', name: 'Uber Eats', icon: '🍔' },
  { id: 'instacart', name: 'Instacart', icon: '🛒' },
  { id: 'doordash', name: 'DoorDash', icon: '🚪' },
  { id: 'roadie', name: 'Roadie', icon: '🛤️' },
  { id: 'lyft', name: 'Lyft', icon: '🚕' },
  { id: 'skip-the-dishes', name: 'Skip The Dishes', icon: '🍽️' },
  { id: 'fetch-delivery', name: 'Fetch Delivery', icon: '📬' },
] as const;

export const SERVICES = [
  {
    id: 'activation',
    name: 'Activation of New Account',
    description: 'Get your new account activated and ready to start earning within 24-48 hours.',
    icon: '🔓',
    price: 232,
  },
  {
    id: 'reactivation',
    name: 'Reactivation',
    description: 'Restore your deactivated account and get back on the road quickly.',
    icon: '🔄',
    price: 314,
  },
  {
    id: 'waitlist',
    name: 'Waitlist Authorization',
    description: 'Skip the waitlist and get authorized to start working immediately.',
    icon: '⏭️',
    price: 219,
  },
  {
    id: 'zone-change',
    name: 'Change of Zone',
    description: 'Transfer your account to a new delivery zone of your choice.',
    icon: '📍',
    price: 105,
  },
  {
    id: 'bot-grabber',
    name: 'Bot Grabber Installation',
    description: 'Install our premium bot grabber to secure more orders automatically.',
    icon: '🤖',
    price: 412,
  },
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marcus Johnson',
    platform: 'Amazon Flex',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'Got my account reactivated in less than 24 hours. These guys are professionals and know exactly what they\'re doing.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    platform: 'DoorDash',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    content: 'Was stuck on the waitlist for months. They got me approved in just 2 days. Highly recommend their services!',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Rodriguez',
    platform: 'Uber Eats',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    content: 'The zone change process was smooth and fast. Great communication throughout the entire process.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Emily Thompson',
    platform: 'Instacart',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content: 'Professional service from start to finish. My account was activated faster than expected.',
    rating: 5,
  },
] as const;

export const CONTACT_INFO = {
  email: 'acc.wisezero@gmail.com',
  whatsapp: '+12344523607',
  telegram: '@gigdriversupport',
  snapchat: 'gigdriversupport',
  instagram: '@gigdriversupportofficial',
} as const;

export const PROCESSING_STAGES = [
  'Initializing secure channel...',
  'Decoding account metadata...',
  'Bypassing gateway protocols...',
  'Verifying credentials...',
  'Synchronizing with platform servers...',
  'Finalizing authorization request...',
] as const;
