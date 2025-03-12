
import { useRoutes } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  const content = useRoutes(AppRoutes);

  return (
    <main>
      {content}
    </main>
  );
}

export default App;
