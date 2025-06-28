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
import { Eye, EyeOff, Mail, Lock, UtensilsCrossed, Truck } from 'lucide-react'

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite'
        }
      }}
    >
      {/* Floating Food Icons */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          animation: 'bounce 3s ease-in-out infinite',
          opacity: 0.1
        }}
      >
        <UtensilsCrossed size={60} color="white" />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          animation: 'bounce 2s ease-in-out infinite 0.5s',
          opacity: 0.1
        }}
      >
        <Truck size={80} color="white" />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          animation: 'bounce 2.5s ease-in-out infinite 1s',
          opacity: 0.1
        }}
      >
        <UtensilsCrossed size={40} color="white" />
      </Box>

      {/* Main Login Container */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          animation: 'slideInUp 0.8s ease-out',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            animation: 'fadeInDown 1s ease-out 0.2s both'
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              mb: 3,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <Truck size={40} color="white" />
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#2d3748',
              mb: 1,
              fontFamily: '"Inter", sans-serif'
            }}
          >
            {t('Welcome Back')}
          </Typography>
          
          <Typography
            sx={{
              color: '#718096',
              fontSize: '16px',
              fontWeight: 400
            }}
          >
            {t('Sign in to your food delivery dashboard')}
          </Typography>
        </Box>

        {/* Form Section */}
        <Box
          component="form"
          ref={formRef}
          sx={{
            '& .MuiInputBase-root': {
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }
            }
          }}
        >
          {/* Email Field */}
          <Box sx={{ mb: 3, animation: 'fadeInLeft 0.8s ease-out 0.4s both' }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: '#2d3748',
                mb: 1,
                fontSize: '14px'
              }}
            >
              {t('Email Address')}
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
              placeholder={t('Enter your email')}
              type="email"
              disableUnderline
              startAdornment={
                <InputAdornment position="start">
                  <Mail size={20} color="#a0aec0" style={{ marginRight: '8px' }} />
                </InputAdornment>
              }
              sx={{
                backgroundColor: '#f7fafc',
                padding: '16px 20px',
                borderRadius: '12px',
                border: stateData.emailError === false ? '2px solid #e53e3e' : 
                       stateData.emailError === true ? '2px solid #38a169' : '2px solid transparent',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#edf2f7'
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  border: '2px solid #667eea'
                }
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 3, animation: 'fadeInLeft 0.8s ease-out 0.6s both' }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: '#2d3748',
                mb: 1,
                fontSize: '14px'
              }}
            >
              {t('Password')}
            </Typography>
            <Input
              fullWidth
              id="input-password"
              name="input-password"
              placeholder={t('Enter your password')}
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
                  <Lock size={20} color="#a0aec0" style={{ marginRight: '8px' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Checkbox
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    color="primary"
                    icon={<EyeOff size={20} color="#a0aec0" />}
                    checkedIcon={<Eye size={20} color="#667eea" />}
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                </InputAdornment>
              }
              sx={{
                backgroundColor: '#f7fafc',
                padding: '16px 20px',
                borderRadius: '12px',
                border: stateData.passwordError === false ? '2px solid #e53e3e' : 
                       stateData.passwordError === true ? '2px solid #38a169' : '2px solid transparent',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#edf2f7'
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  border: '2px solid #667eea'
                }
              }}
            />
          </Box>

          {/* Remember Me & Forgot Password */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              animation: 'fadeInRight 0.8s ease-out 0.8s both'
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked sx={{ color: '#667eea' }} />}
                label={t('Remember Me')}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px',
                    color: '#4a5568'
                  }
                }}
              />
            </FormGroup>
            
            <Link
              href="/#/auth/reset"
              sx={{
                textDecoration: 'none',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#5a67d8',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {t('Forgot Password?')}
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            fullWidth
            onClick={loginFunc}
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              animation: 'fadeInUp 0.8s ease-out 1s both',
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
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                {t('Signing In...')}
              </Box>
            ) : (
              t('Sign In')
            )}
          </Button>
        </Box>

        {/* Error Alert */}
        {stateData.error && (
          <Box
            sx={{
              mt: 3,
              animation: 'shake 0.5s ease-in-out'
            }}
          >
            <Alert
              severity="error"
              sx={{
                borderRadius: '12px',
                backgroundColor: '#fed7d7',
                color: '#9b2c2c',
                border: '1px solid #feb2b2',
                '& .MuiAlert-icon': {
                  color: '#e53e3e'
                }
              }}
            >
              {stateData.error}
            </Alert>
          </Box>
        )}
      </Box>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </Box>
  )
}

export default withTranslation()(Login)
