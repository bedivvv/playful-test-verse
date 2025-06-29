
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
  Container
} from '@mui/material';
import { 
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  RestaurantMenu
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { ownerLogin } from '../apollo';

const LOGIN = gql`
  ${ownerLogin}
`;

// Modern animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Modern styled components
const LoginContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    zIndex: 1
  }
});

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '440px',
  zIndex: 2,
  position: 'relative',
  animation: `${slideUp} 0.6s ease-out`,
  border: '1px solid rgba(255, 255, 255, 0.2)'
}));

const LogoContainer = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  animation: `${fadeIn} 0.8s ease-out 0.2s both`
});

const LogoIcon = styled(Box)({
  width: '80px',
  height: '80px',
  background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)'
});

const WelcomeText = styled(Typography)({
  fontSize: '28px',
  fontWeight: '700',
  color: '#2d3748',
  marginBottom: '8px',
  animation: `${slideUp} 0.6s ease-out 0.3s both`
});

const SubText = styled(Typography)({
  fontSize: '16px',
  color: '#718096',
  marginBottom: '32px',
  animation: `${slideUp} 0.6s ease-out 0.4s both`
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: '#f7fafc',
    border: 'none',
    transition: 'all 0.3s ease',
    '& fieldset': {
      border: '2px solid transparent'
    },
    '&:hover': {
      backgroundColor: '#edf2f7',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
      '& fieldset': {
        border: '2px solid #667eea'
      }
    }
  },
  '& .MuiInputLabel-root': {
    color: '#4a5568',
    fontWeight: '500'
  },
  '& .MuiInputBase-input': {
    padding: '16px',
    fontSize: '16px'
  }
}));

const LoginButton = styled(Button)({
  borderRadius: '16px',
  padding: '16px 0',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
  },
  '&:active': {
    transform: 'translateY(0px)'
  },
  '&:disabled': {
    background: '#cbd5e0',
    color: '#a0aec0'
  }
});

const ForgotPasswordLink = styled(Typography)({
  textAlign: 'center',
  marginTop: '24px',
  color: '#667eea',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#5a67d8',
    textDecoration: 'underline'
  }
});

const FormContainer = styled(Box)({
  animation: `${slideUp} 0.6s ease-out 0.5s both`
});

function Login({ t, history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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
    <LoginContainer>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <LoginCard elevation={0}>
            <LogoContainer>
              <LogoIcon>
                <RestaurantMenu sx={{ fontSize: 40, color: 'white' }} />
              </LogoIcon>
              <WelcomeText>
                Welcome Back
              </WelcomeText>
              <SubText>
                Sign in to your account to continue
              </SubText>
            </LogoContainer>

            {error && (
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '12px',
                    backgroundColor: '#fed7d7',
                    border: '1px solid #feb2b2',
                    color: '#c53030'
                  }}
                >
                  {error.message || t('LoginFailed')}
                </Alert>
              </Fade>
            )}

            <FormContainer>
              <Box component="form" onSubmit={handleSubmit}>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#a0aec0' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#a0aec0' }} />
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

                <LoginButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </LoginButton>

                <ForgotPasswordLink onClick={() => history.push('/auth/reset')}>
                  Forgot your password?
                </ForgotPasswordLink>
              </Box>
            </FormContainer>
          </LoginCard>
        </Fade>
      </Container>
    </LoginContainer>
  );
}

export default withTranslation()(Login);
