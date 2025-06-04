import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { loginRateLimiter, validateInput, ValidationRules, SessionManager } from '@/utils/security';
import { Shield, AlertTriangle } from 'lucide-react';
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const {
    login
  } = usePortfolio();
  const {
    toast
  } = useToast();

  // Get user's IP or identifier for rate limiting
  const getUserIdentifier = () => {
    return 'user_' + (navigator.userAgent + navigator.language).slice(0, 20);
  };
  const validateForm = (): boolean => {
    const errors: {
      username?: string;
      password?: string;
    } = {};
    const usernameValidation = validateInput(username, {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_]+$/
    });
    const passwordValidation = validateInput(password, {
      minLength: 6,
      maxLength: 100
    });
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error;
    }
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userIdentifier = getUserIdentifier();

    // Check rate limiting
    const rateLimitCheck = loginRateLimiter.checkRateLimit(userIdentifier);
    if (!rateLimitCheck.allowed) {
      setIsBlocked(true);
      setBlockTimeRemaining(rateLimitCheck.blockTimeRemaining || 0);
      toast({
        title: "Muitas tentativas de login",
        description: `Aguarde ${rateLimitCheck.blockTimeRemaining} minutos antes de tentar novamente.`,
        variant: "destructive"
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Dados inválidos",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Simulate secure authentication delay (prevent timing attacks)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      const success = login(username, password);

      // Record attempt
      loginRateLimiter.recordAttempt(userIdentifier, success);
      if (success) {
        // Set secure session
        SessionManager.setSecureSession('secure_token_' + Date.now(), 3600000); // 1 hour

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao painel administrativo."
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha incorretos.",
          variant: "destructive"
        });

        // Show remaining attempts
        const newRateLimitCheck = loginRateLimiter.checkRateLimit(userIdentifier);
        if (newRateLimitCheck.remainingAttempts !== undefined && newRateLimitCheck.remainingAttempts < 3) {
          toast({
            title: "Atenção",
            description: `Restam ${newRateLimitCheck.remainingAttempts} tentativas antes do bloqueio.`
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro interno",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-portfolio-primary" />
          <h1 className="text-3xl font-bold text-portfolio-dark mb-2">
            Portfolio Admin
          </h1>
          <p className="text-portfolio-secondary">
            Acesso seguro ao painel administrativo
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-portfolio-dark">
              Entrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isBlocked && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">
                    Conta temporariamente bloqueada por {blockTimeRemaining} minutos
                  </span>
                </div>
              </div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className={`h-11 ${validationErrors.username ? 'border-red-500' : ''}`} placeholder="Digite seu usuário" disabled={isLoading || isBlocked} autoComplete="username" />
                {validationErrors.username && <p className="text-red-500 text-sm">{validationErrors.username}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className={`h-11 ${validationErrors.password ? 'border-red-500' : ''}`} placeholder="Digite sua senha" disabled={isLoading || isBlocked} autoComplete="current-password" />
                {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
              </div>

              <Button type="submit" className="w-full h-11 bg-portfolio-primary hover:bg-portfolio-primary/90" disabled={isLoading || isBlocked}>
                {isLoading ? 'Verificando...' : 'Entrar'}
              </Button>
            </form>
            
            

            <div className="mt-4 text-xs text-gray-500 text-center">
              <Shield className="inline h-3 w-3 mr-1" />
              Conexão segura protegida
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default LoginForm;