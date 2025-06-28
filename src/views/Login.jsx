
import React, { useState, useEffect, useRef } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Box,
  Alert,
  Typography,
  Input,
  Button,
  Grid,
  Link,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress
} from '@mui/material'

import { useMutation, gql } from '@apollo/client'
import { ownerLogin } from '../apollo'
import { validateFunc } from '../constraints/constraints'
import useStyles from '../components/Configuration/styles'
import useGlobalStyles from '../utils/globalStyles'
import InputAdornment from '@mui/material/InputAdornment'
import { Eye, EyeOff, Mail, Lock, UtensilsCrossed, Truck, ChefHat } from 'lucide-react'

const LOGIN = gql`
  ${ownerLogin}
`

const Login = props => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stateData, setStateData] = useState({
    email: 'admin@gmail.com',
    password: '123123',
    emailError: null,
    passwordError: null,
    error: null,
    type: null,
    redirectToReferrer: !!localStorage.getItem('user-enatega')
  })
  const formRef = useRef()
  const { t } = props

  const [isLogged, setIsLogged] = useState(false)
  
  const onBlur = (event, field) => {
    setStateData({
      ...stateData,
      [field + 'Error']: !validateFunc({ [field]: stateData[field] }, field)
    })
  }
  
  const validate = () => {
    const emailError = !validateFunc({ email: stateData.email }, 'email')
    const passwordError = !validateFunc(
      { password: stateData.password },
      'password'
    )
    setStateData({ ...stateData, emailError, passwordError })
    return emailError && passwordError
  }
  
  const { redirectToReferrer, type } = stateData

  useEffect(() => {
    if (isLogged) {
      if (redirectToReferrer && type === 0) {
        props.history.replace('/restaurant/list')
      }
      if (redirectToReferrer && type === 1) {
        props.history.replace('/super_admin/vendors')
      }
    }
  }, [isLogged])

  const onCompleted = data => {
    localStorage.setItem('user-enatega', JSON.stringify(data.ownerLogin))
    const userType = data.ownerLogin.userType
    if (userType === 'VENDOR') {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 0,
        emailError: null,
        passwordError: null
      })
    } else {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 1,
        emailError: null,
        passwordError: null
      })
    }
    setIsLoading(false)
    setIsLogged(true)
    setTimeout(hideAlert, 5000)
  }
  
  const hideAlert = () => {
    setStateData({
      ...stateData,
      emailError: null,
      passwordError: null,
      error: null
    })
  }
  
  const onError = error => {
    if (error.graphQLErrors.length) {
      setStateData({
        ...stateData,
        error: error.graphQLErrors[0].message
      })
    }
    if (error.networkError) {
      setStateData({
        ...stateData,
        error: error.message
      })
    }
    setIsLoading(false)
    setIsLogged(false)
    setTimeout(hideAlert, 5000)
  }
  
  const [mutate] = useMutation(LOGIN, { onError, onCompleted })

  const loginFunc = async() => {
    if (validate()) {
      setIsLoading(true)
      mutate({ variables: { ...stateData } })
    }
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
          animation: 'float 6s ease-in-out infinite'
        }
      }}
    >
      {/* Floating Food Icons with enhanced animations */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          animation: 'bounce 4s ease-in-out infinite',
          opacity: 0.1,
          transform: 'rotate(-15deg)'
        }}
      >
        <UtensilsCrossed size={80} color="white" />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: '12%',
          animation: 'bounce 3s ease-in-out infinite 1s',
          opacity: 0.15,
          transform: 'rotate(20deg)'
        }}
      >
        <Truck size={100} color="white" />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          animation: 'bounce 3.5s ease-in-out infinite 0.5s',
          opacity: 0.12,
          transform: 'rotate(10deg)'
        }}
      >
        <ChefHat size={60} color="white" />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '25%',
          animation: 'float 5s ease-in-out infinite 2s',
          opacity: 0.08
        }}
      >
        <UtensilsCrossed size={45} color="white" />
      </Box>

      {/* Main Login Container with enhanced design */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(25px)',
          borderRadius: '28px',
          padding: '56px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          animation: 'slideInUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            transform: 'translateY(-5px)',
            transition: 'transform 0.4s ease'
          }
        }}
      >
        {/* Header Section with enhanced styling */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 5,
            animation: 'fadeInDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both'
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              mb: 4,
              animation: 'pulse 3s ease-in-out infinite',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                zIndex: -1,
                opacity: 0.3,
                animation: 'spin 8s linear infinite'
              }
            }}
          >
            <Truck size={45} color="white" />
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Welcome Back
          </Typography>
          
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: 1.6
            }}
          >
            Sign in to your food delivery dashboard
          </Typography>
        </Box>

        {/* Form Section with enhanced interactions */}
        <Box
          component="form"
          ref={formRef}
          sx={{
            '& .MuiInputBase-root': {
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)'
              },
              '&.Mui-focused': {
                transform: 'translateY(-3px)',
                boxShadow: '0 20px 50px rgba(102, 126, 234, 0.25)'
              }
            }
          }}
        >
          {/* Email Field with enhanced styling */}
          <Box sx={{ mb: 4, animation: 'fadeInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#374151',
                mb: 2,
                fontSize: '15px',
                letterSpacing: '0.01em'
              }}
            >
              Email Address
            </Typography>
            <Input
              fullWidth
              id="input-email"
              name="input-email"
              value={stateData.email}
              onChange={event => {
                setStateData({ ...stateData, email: event.target.value })
              }}
              onBlur={event => {
                onBlur(event, 'email')
              }}
              placeholder="Enter your email"
              type="email"
              disableUnderline
              startAdornment={
                <InputAdornment position="start">
                  <Mail size={22} color="#9ca3af" style={{ marginRight: '12px' }} />
                </InputAdornment>
              }
              sx={{
                backgroundColor: '#f8fafc',
                padding: '18px 24px',
                borderRadius: '16px',
                border: stateData.emailError === false ? '2px solid #ef4444' : 
                       stateData.emailError === true ? '2px solid #10b981' : '2px solid transparent',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  border: '2px solid #667eea'
                }
              }}
            />
          </Box>

          {/* Password Field with enhanced styling */}
          <Box sx={{ mb: 4, animation: 'fadeInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both' }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#374151',
                mb: 2,
                fontSize: '15px',
                letterSpacing: '0.01em'
              }}
            >
              Password
            </Typography>
            <Input
              fullWidth
              id="input-password"
              name="input-password"
              placeholder="Enter your password"
              value={stateData.password}
              type={showPassword ? 'text' : 'password'}
              onChange={event => {
                setStateData({
                  ...stateData,
                  password: event.target.value
                })
              }}
              onBlur={event => {
                onBlur(event, 'password')
              }}
              disableUnderline
              startAdornment={
                <InputAdornment position="start">
                  <Lock size={22} color="#9ca3af" style={{ marginRight: '12px' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      minWidth: 'auto',
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {showPassword ? 
                      <Eye size={20} color="#667eea" /> : 
                      <EyeOff size={20} color="#9ca3af" />
                    }
                  </Button>
                </InputAdornment>
              }
              sx={{
                backgroundColor: '#f8fafc',
                padding: '18px 24px',
                borderRadius: '16px',
                border: stateData.passwordError === false ? '2px solid #ef4444' : 
                       stateData.passwordError === true ? '2px solid #10b981' : '2px solid transparent',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  border: '2px solid #667eea'
                }
              }}
            />
          </Box>

          {/* Remember Me & Forgot Password with enhanced styling */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 5,
              animation: 'fadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both'
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    defaultChecked 
                    sx={{ 
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }} 
                  />
                }
                label="Remember Me"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '15px',
                    color: '#4b5563',
                    fontWeight: 500
                  }
                }}
              />
            </FormGroup>
            
            <Link
              href="/#/auth/reset"
              sx={{
                textDecoration: 'none',
                color: '#667eea',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#5a67d8',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          {/* Login Button with enhanced design */}
          <Button
            fullWidth
            onClick={loginFunc}
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '18px',
              borderRadius: '16px',
              fontSize: '17px',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both',
              letterSpacing: '0.01em',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 25px 50px rgba(102, 126, 234, 0.5)',
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              },
              '&:active': {
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
                boxShadow: 'none'
              }
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={22} sx={{ color: 'white' }} />
                Signing In...
              </Box>
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        {/* Error Alert with enhanced styling */}
        {stateData.error && (
          <Box
            sx={{
              mt: 4,
              animation: 'shake 0.6s ease-in-out'
            }}
          >
            <Alert
              severity="error"
              sx={{
                borderRadius: '16px',
                backgroundColor: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                fontWeight: 500,
                '& .MuiAlert-icon': {
                  color: '#ef4444'
                }
              }}
            >
              {stateData.error}
            </Alert>
          </Box>
        )}
      </Box>

      {/* Enhanced Custom Styles */}
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-25px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 20px 45px rgba(102, 126, 234, 0.6);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(2deg);
          }
          66% {
            transform: translateY(-10px) rotate(-2deg);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-8px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(8px);
          }
        }
      `}</style>
    </Box>
  )
}

export default withTranslation()(Login)
