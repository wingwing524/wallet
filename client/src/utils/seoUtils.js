// SEO utility functions for dynamic meta tag management

export const updateMetaTag = (name, content) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export const updateOGTag = (property, content) => {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export const setPageSEO = (title, description, keywords = '') => {
  // Update document title
  document.title = title;
  
  // Update meta description
  updateMetaTag('description', description);
  
  // Update keywords if provided
  if (keywords) {
    updateMetaTag('keywords', keywords);
  }
  
  // Update Open Graph tags
  updateOGTag('og:title', title);
  updateOGTag('og:description', description);
  
  // Update Twitter tags
  updateOGTag('twitter:title', title);
  updateOGTag('twitter:description', description);
};

// Predefined SEO data for different pages
export const seoData = {
  dashboard: {
    title: 'Dashboard - ExpenseTracker',
    description: 'View your expense dashboard with budget tracking, spending insights, and financial overview. Monitor your monthly spending and stay on budget.',
    keywords: 'expense dashboard, budget tracker, spending overview, financial insights'
  },
  expenses: {
    title: 'Expenses - ExpenseTracker',
    description: 'Manage and track all your expenses. Add, edit, and categorize your spending to better understand your financial habits.',
    keywords: 'expense list, expense management, spending tracker, expense categories'
  },
  friends: {
    title: 'Friends - ExpenseTracker',
    description: 'Connect with friends and track shared expenses. Monitor spending patterns and split costs with your social network.',
    keywords: 'friends expenses, shared costs, social spending, expense sharing'
  },
  login: {
    title: 'Login - ExpenseTracker',
    description: 'Sign in to your ExpenseTracker account to access your personal finance dashboard and expense tracking tools.',
    keywords: 'login, sign in, expense tracker account'
  },
  register: {
    title: 'Sign Up - ExpenseTracker',
    description: 'Create your free ExpenseTracker account and start managing your personal finances with our smart expense tracking tools.',
    keywords: 'sign up, register, create account, expense tracker'
  }
};

const seoUtils = {
  updateMetaTag,
  updateOGTag,
  setPageSEO,
  seoData
};

export default seoUtils;