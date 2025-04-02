
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient()

// Ensure theme is loaded before first render with smooth transition
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.classList.add(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

// Add transition class
document.documentElement.classList.add('theme-transition');

// Remove transition class after initial load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition');
  }, 0);
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
