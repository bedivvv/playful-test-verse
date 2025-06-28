
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
  Container,
  Paper,
  Fade,
  Slide,
  Zoom
} from '@mui/material'
import { useMutation, gql } from '@apollo/client'
import { ownerLogin } from '../apollo'
import { validateFunc } from '../constraints/constraints'
import useStyles from '../components/Configuration/styles'
import useGlobalStyles from '../utils/globalStyles'
import LoginBg from '../assets/img/loginBg.png'
import LoginPageIcon from '../assets/img/LoginPageIcon.png'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import { keyframes } from '@mui/system'

const LOGIN = gql`
  ${ownerLogin}
`

// Animation keyframes
const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const fadeInUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

const Login = props => {
  const [showPassword, setShowPassword] = useState(false)
  const [animationTrigger, setAnimationTrigger] = useState(false)
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

  useEffect(() => {
    setAnimationTrigger(true)
  }, [])

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
    setIsLogged(true)
    setTimeout(hideAlert, 5000)
  }

  const hideAlert = () => {
    setStateData({
      ...stateData,
      emailError: null,
      passwordError: null
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
    setIsLogged(false)
    setTimeout(hideAlert, 5000)
  }

  const [mutate] = useMutation(LOGIN, { onError, onCompleted })

  const loginFunc = async() => {
    if (validate()) {
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
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(${LoginBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 0
        }
      }}
    >
      {/* Floating food icons */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          animation: `${float} 3s ease-in-out infinite`,
          animationDelay: '0s',
          zIndex: 1
        }}
      >
        <RestaurantIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.1)' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          animation: `${float} 3s ease-in-out infinite`,
          animationDelay: '1s',
          zIndex: 1
        }}
      >
        <DeliveryDiningIcon sx={{ fontSize: 35, color: 'rgba(255,255,255,0.1)' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          animation: `${float} 3s ease-in-out infinite`,
          animationDelay: '2s',
          zIndex: 1
        }}
      >
        <RestaurantIcon sx={{ fontSize: 30, color: 'rgba(255,255,255,0.1)' }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Left side - Branding */}
          <Grid item xs={12} md={6}>
            <Slide direction="right" in={animationTrigger} timeout={800}>
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  color: 'white',
                  mb: { xs: 4, md: 0 }
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    animation: `${fadeInUp} 1s ease-out`,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Food Delivery
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 300,
                    mb: 3,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    animation: `${fadeInUp} 1s ease-out 0.2s both`,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    opacity: 0.9,
                    animation: `${fadeInUp} 1s ease-out 0.4s both`,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  Manage your restaurants, orders, and deliveries with ease
                </Typography>
                <Box
                  sx={{
                    mt: 4,
                    animation: `${fadeInUp} 1s ease-out 0.6s both`,
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  <img
                    src={LoginPageIcon}
                    alt="Food Delivery"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                    }}
                  />
                </Box>
              </Box>
            </Slide>
          </Grid>

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Slide direction="left" in={animationTrigger} timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 45px rgba(0,0,0,0.1)',
                  animation: `${fadeInUp} 1s ease-out 0.3s both`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Zoom in={animationTrigger} timeout={1000}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f28821 0%, #f09d4c 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        animation: `${pulse} 2s ease-in-out infinite`,
                        boxShadow: '0 10px 20px rgba(242, 136, 33, 0.3)'
                      }}
                    >
                      <RestaurantIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                  </Zoom>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                      mb: 1,
                      animation: `${fadeInUp} 1s ease-out 0.5s both`
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#666',
                      animation: `${fadeInUp} 1s ease-out 0.7s both`
                    }}
                  >
                    {t('enterYourDetailsBelow')}
                  </Typography>
                </Box>

                <Box sx={{ animation: `${fadeInUp} 1s ease-out 0.9s both` }}>
                  <form ref={formRef}>
                    {/* Email Input */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#555',
                          mb: 1,
                          ml: 1
                        }}
                      >
                        {t('Email')}
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
                        placeholder={t('Email')}
                        type="email"
                        disableUnderline
                        startAdornment={
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#f28821', mr: 1 }} />
                          </InputAdornment>
                        }
                        sx={{
                          backgroundColor: 'white',
                          height: 50,
                          fontSize: 16,
                          padding: '0 20px',
                          borderRadius: 2,
                          border: stateData.emailError === false 
                            ? '2px solid #f44336' 
                            : stateData.emailError === true 
                            ? '2px solid #f28821' 
                            : '2px solid #e0e0e0',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            transform: 'translateY(-2px)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(242, 136, 33, 0.3)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      />
                    </Box>

                    {/* Password Input */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#555',
                          mb: 1,
                          ml: 1
                        }}
                      >
                        {t('Password')}
                      </Typography>
                      <Input
                        fullWidth
                        id="input-password"
                        name="input-password"
                        placeholder={t('Password')}
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
                            <LockIcon sx={{ color: '#f28821', mr: 1 }} />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <Checkbox
                              checked={showPassword}
                              onChange={() => setShowPassword(!showPassword)}
                              icon={<VisibilityOffIcon sx={{ color: '#999' }} />}
                              checkedIcon={<VisibilityIcon sx={{ color: '#f28821' }} />}
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(242, 136, 33, 0.1)'
                                }
                              }}
                            />
                          </InputAdornment>
                        }
                        sx={{
                          backgroundColor: 'white',
                          height: 50,
                          fontSize: 16,
                          padding: '0 20px',
                          borderRadius: 2,
                          border: stateData.passwordError === false 
                            ? '2px solid #f44336' 
                            : stateData.passwordError === true 
                            ? '2px solid #f28821' 
                            : '2px solid #e0e0e0',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            transform: 'translateY(-2px)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(242, 136, 33, 0.3)',
                            transform: 'translateY(-2px)'
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
                        mb: 3
                      }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              defaultChecked 
                              sx={{
                                color: '#f28821',
                                '&.Mui-checked': {
                                  color: '#f28821'
                                }
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: 14, color: '#666' }}>
                              {t('RememberMe')}
                            </Typography>
                          }
                        />
                      </FormGroup>
                      <Link
                        href="/#/auth/reset"
                        sx={{
                          textDecoration: 'none',
                          color: '#f28821',
                          fontWeight: 600,
                          fontSize: 14,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#f09d4c',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {t('ForgotYourPassword')}
                      </Link>
                    </Box>

                    {/* Login Button */}
                    <Button
                      fullWidth
                      onClick={loginFunc}
                      sx={{
                        height: 50,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #f28821 0%, #f09d4c 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 16,
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(242, 136, 33, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e07a1a 0%, #e08a3a 100%)',
                          boxShadow: '0 6px 20px rgba(242, 136, 33, 0.6)',
                          transform: 'translateY(-2px)'
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      {t('Login')}
                    </Button>
                  </form>

                  {/* Error Alert */}
                  {stateData.error && (
                    <Fade in={!!stateData.error} timeout={500}>
                      <Box sx={{ mt: 2 }}>
                        <Alert
                          severity="error"
                          sx={{
                            borderRadius: 2,
                            animation: `${fadeInUp} 0.5s ease-out`
                          }}
                        >
                          {stateData.error}
                        </Alert>
                      </Box>
                    </Fade>
                  )}
                </Box>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default withTranslation()(Login)
