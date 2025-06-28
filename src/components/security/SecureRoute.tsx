
import React, { useEffect } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { SessionManager } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

interface SecureRouteProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

const SecureRoute: React.FC<SecureRouteProps> = ({ children, fallback }) => {
  const { toast } = useToast();

  // Verificar se temos um contexto válido
  let isAuthenticated = false;
  let logout = () => {};

  try {
    const context = usePortfolio();
    isAuthenticated = context.isAuthenticated;
    logout = context.logout;
  } catch (error) {
    console.log('PortfolioContext not available, using fallback auth check');
    // Fallback: verificar sessão diretamente
    const session = SessionManager.getSession();
    isAuthenticated = !!session;
  }

  useEffect(() => {
    // Check session validity on mount and every minute
    const checkSession = () => {
      const session = SessionManager.getSession();
      
      if (isAuthenticated && !session) {
        logout();
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Faça login novamente.",
          variant: "destructive",
        });
      } else if (session && SessionManager.isSessionExpiringSoon()) {
        toast({
          title: "Sessão expirando",
          description: "Sua sessão expirará em breve. Salve seu trabalho.",
        });
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, logout, toast]);

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SecureRoute;
