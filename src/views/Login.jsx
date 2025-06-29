
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useMutation, gql } from '@apollo/client';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  InputAdornment,
  IconButton,
  Alert,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import { 
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Restaurant as RestaurantIcon,
  LocalPizza as PizzaIcon,
  Fastfood as FastfoodIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { ownerLogin } from '../apollo';

const LOGIN = gql`
  ${ownerLogin}
`;

// Floating animation for food icons
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(5deg); }
  50% { transform: translateY(-10px) rotate(-3deg); }
  75% { transform: translateY(-15px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const slideInFromLeft = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideInFromRight = keyframes`
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main} 0%, 
    ${theme.palette.secondary.main} 50%, 
    ${theme.palette.warning.main} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.1)',
    zIndex: 1
  }
}));

const FloatingIcon = styled(Box)(({ theme, delay = 0, size = 40 }) => ({
  position: 'absolute',
  fontSize: size,
  color: 'rgba(255,255,255,0.3)',
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  zIndex: 2
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 25px 45px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: 450,
  zIndex: 10,
  position: 'relative',
  animation: `${slideInFromLeft} 0.8s ease-out`
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  animation: `${slideInFromRight} 0.8s ease-out 0.2s both`
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 20px rgba(0,0,0,0.15)'
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
  },
  '&:active': {
    transform: 'translateY(-1px)'
  }
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  animation: `${pulse} 2s ease-in-out infinite`
}));

function Login({ t, history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  // Show form with delay for animation
  React.useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.ownerLogin.token) {
        localStorage.setItem('user-enatega', JSON.stringify(data.ownerLogin));
        
        if (data.ownerLogin.userType === 'ADMIN') {
          history.push('/super_admin/dashboard');
        } else {
          localStorage.setItem('restaurantId', data.ownerLogin.restaurantId);
          localStorage.setItem('restaurantName', data.ownerLogin.restaurantName);
          localStorage.setItem('restaurantImage', data.ownerLogin.restaurantImage);
          history.push('/admin/dashboard');
        }
      }
    },
    onError: (apolloError) => {
      console.error('Login error:', apolloError);
      setErrors({ general: apolloError.message || 'Login failed' });
    }
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = t('EmailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('EmailInvalid');
    }
    
    if (!password) {
      newErrors.password = t('PasswordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('PasswordTooShort');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login({
        variables: {
          email: email.toLowerCase().trim(),
          password
        }
      });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledContainer>
      {/* Floating Food Icons */}
      <FloatingIcon style={{ top: '10%', left: '15%' }} delay={0} size={60}>
        <PizzaIcon fontSize="inherit" />
      </FloatingIcon>
      <FloatingIcon style={{ top: '20%', right: '20%' }} delay={1} size={45}>
        <FastfoodIcon fontSize="inherit" />
      </FloatingIcon>
      <FloatingIcon style={{ bottom: '25%', left: '10%' }} delay={2} size={50}>
        <RestaurantIcon fontSize="inherit" />
      </FloatingIcon>
      <FloatingIcon style={{ bottom: '15%', right: '15%' }} delay={1.5} size={40}>
        <PizzaIcon fontSize="inherit" />
      </FloatingIcon>
      <FloatingIcon style={{ top: '60%', left: '80%' }} delay={0.5} size={35}>
        <FastfoodIcon fontSize="inherit" />
      </FloatingIcon>

      <Fade in timeout={1000}>
        <LoginCard elevation={24}>
          <LogoSection>
            <RestaurantIcon sx={{ fontSize: 48, color: 'primary.main', mr: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Heart Attack
            </Typography>
          </LogoSection>

          <WelcomeSection>
            <Typography variant="h5" sx={{ fontWeight: '600', color: 'text.primary', mb: 1 }}>
              {t('WelcomeBack')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('SignInToContinue')}
            </Typography>
          </WelcomeSection>

          {error && (
            <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error.message || t('LoginFailed')}
              </Alert>
            </Slide>
          )}

          <Zoom in={showForm} timeout={600}>
            <Box component="form" onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                variant="outlined"
                label={t('Email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                variant="outlined"
                label={t('Password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 2, mb: 2 }}
              >
                {loading ? t('SigningIn') : t('SignIn')}
              </StyledButton>

              <Box textAlign="center">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'primary.main', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={() => history.push('/auth/reset')}
                >
                  {t('ForgotPassword')}
                </Typography>
              </Box>
            </Box>
          </Zoom>
        </LoginCard>
      </Fade>
    </StyledContainer>
  );
}

export default withTranslation()(Login);
