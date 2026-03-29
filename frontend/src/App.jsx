import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import CustomCursor from './components/common/CustomCursor';

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {/* Custom track cursor */}
        <CustomCursor />


        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
