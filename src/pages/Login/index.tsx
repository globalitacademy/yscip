
import { useLoginPage } from './hooks/useLoginPage';
import { LoginView } from './components/LoginView';

const Login = () => {
  const {
    handleLogin,
    handleRegister,
    isLoading,
    verificationSent,
    email,
    showAdminReset,
    registeredRole,
    user,
    isAuthenticated,
    isApproved
  } = useLoginPage();

  return (
    <LoginView
      onLogin={handleLogin}
      onRegister={handleRegister}
      isLoading={isLoading}
      verificationSent={verificationSent}
      email={email}
      showAdminReset={showAdminReset}
      registeredRole={registeredRole}
      isAuthenticated={isAuthenticated}
      user={user}
      isApproved={isApproved}
    />
  );
};

export default Login;
