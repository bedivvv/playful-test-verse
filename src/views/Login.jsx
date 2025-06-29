
import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import {
  Box,
  Alert,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Container,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

import { useMutation, gql } from "@apollo/client";
import { ownerLogin } from "../apollo";
import { validateFunc } from "../constraints/constraints";

const LOGIN = gql`
  ${ownerLogin}
`;

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const slideInLeft = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(242, 136, 33, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(242, 136, 33, 0); }
  100% { box-shadow: 0 0 0 0 rgba(242, 136, 33, 0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(242, 136, 33, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(240, 157, 76, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(185, 81, 21, 0.05) 0%, transparent 50%)
    `,
  }
}));

const FloatingIcon = styled(Box)(({ delay = 0 }) => ({
  position: 'absolute',
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  opacity: 0.1,
  color: '#fff',
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  animation: `${fadeInUp} 0.8s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #f28821, #f09d4c)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(242, 136, 33, 0.2)',
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #f28821, #f09d4c)',
  transition: 'all 0.3s ease',
  animation: `${pulse} 2s infinite`,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 30px rgba(242, 136, 33, 0.4)',
    background: 'linear-gradient(45deg, #f09d4c, #f28821)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
  }
}));

const BrandSection = styled(Box)(() => ({
  animation: `${slideInLeft} 1s ease-out`,
  textAlign: 'center',
  color: 'white',
}));

const FormSection = styled(Box)(() => ({
  animation: `${slideInRight} 1s ease-out 0.2s both`,
}));

const Login = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [stateData, setStateData] = useState({
    email: "admin@gmail.com",
    password: "123123",
    emailError: null,
    passwordError: null,
    error: null,
    type: null,
    redirectToReferrer: !!localStorage.getItem("user-enatega"),
  });
  const [isLogged, setIsLogged] = useState(false);
  const { t } = props;

  const onBlur = (event, field) => {
    setStateData({
      ...stateData,
      [field + "Error"]: !validateFunc({ [field]: stateData[field] }, field),
    });
  };

  const validate = () => {
    const emailError = !validateFunc({ email: stateData.email }, "email");
    const passwordError = !validateFunc(
      { password: stateData.password },
      "password"
    );
    setStateData({ ...stateData, emailError, passwordError });
    return emailError && passwordError;
  };

  const { redirectToReferrer, type } = stateData;

  useEffect(() => {
    if (isLogged) {
      if (redirectToReferrer && type === 0) {
        props.history.replace("/restaurant/list");
      }
      if (redirectToReferrer && type === 1) {
        props.history.replace("/super_admin/vendors");
      }
    }
  }, [isLogged, redirectToReferrer, type, props.history]);

  const onCompleted = (data) => {
    localStorage.setItem("user-enatega", JSON.stringify(data.ownerLogin));
    const userType = data.ownerLogin.userType;
    if (userType === "VENDOR") {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 0,
        emailError: null,
        passwordError: null,
      });
    } else {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 1,
        emailError: null,
        passwordError: null,
      });
    }
    setIsLogged(true);
    setTimeout(hideAlert, 5000);
  };

  const hideAlert = () => {
    setStateData({
      ...stateData,
      emailError: null,
      passwordError: null,
      error: null,
    });
  };

  const onError = (error) => {
    if (error.graphQLErrors.length) {
      setStateData({
        ...stateData,
        error: error.graphQLErrors[0].message,
      });
    }
    if (error.networkError) {
      setStateData({
        ...stateData,
        error: error.message,
      });
    }
    setIsLogged(false);
    setTimeout(hideAlert, 5000);
  };

  const [mutate] = useMutation(LOGIN, { onError, onCompleted });

  const loginFunc = async () => {
    if (validate()) {
      mutate({ variables: { ...stateData } });
    }
  };

  return (
    <LoginContainer>
      {/* Floating Food Icons */}
      <FloatingIcon sx={{ top: '10%', left: '10%' }} delay={0}>
        <RestaurantMenuIcon sx={{ fontSize: 60 }} />
      </FloatingIcon>
      <FloatingIcon sx={{ top: '70%', left: '5%' }} delay={2}>
        <LocalDiningIcon sx={{ fontSize: 40 }} />
      </FloatingIcon>
      <FloatingIcon sx={{ top: '20%', right: '15%' }} delay={4}>
        <DeliveryDiningIcon sx={{ fontSize: 50 }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: '20%', right: '10%' }} delay={1}>
        <RestaurantMenuIcon sx={{ fontSize: 45 }} />
      </FloatingIcon>

      <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} sx={{ height: '100%', alignItems: 'center' }}>
          {/* Brand Section */}
          <Grid item xs={12} md={6}>
            <BrandSection>
              <Fade in timeout={1000}>
                <Box>
                  <Zoom in timeout={1200} style={{ transitionDelay: '500ms' }}>
                    <Box sx={{ mb: 4 }}>
                      <RestaurantMenuIcon sx={{ fontSize: 80, mb: 2, color: '#f28821' }} />
                    </Box>
                  </Zoom>
                  
                  <Slide direction="right" in timeout={1000} style={{ transitionDelay: '300ms' }}>
                    <Typography variant="h2" component="h1" sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      background: 'linear-gradient(45deg, #f28821, #f09d4c)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Enatega
                    </Typography>
                  </Slide>

                  <Slide direction="right" in timeout={1000} style={{ transitionDelay: '600ms' }}>
                    <Typography variant="h5" sx={{ 
                      opacity: 0.9, 
                      mb: 3,
                      fontWeight: 300 
                    }}>
                      {t("DeliciousFoodDelivered")}
                    </Typography>
                  </Slide>

                  <Slide direction="right" in timeout={1000} style={{ transitionDelay: '900ms' }}>
                    <Typography variant="body1" sx={{ 
                      opacity: 0.8,
                      maxWidth: 400,
                      mx: 'auto'
                    }}>
                      {t("ExperienceTheFinestFoodDeliveryWithOurPremiumService")}
                    </Typography>
                  </Slide>
                </Box>
              </Fade>
            </BrandSection>
          </Grid>

          {/* Login Form Section */}
          <Grid item xs={12} md={6}>
            <FormSection>
              <LoginCard elevation={0}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" component="h2" sx={{ 
                    fontWeight: 600, 
                    color: '#333',
                    mb: 1 
                  }}>
                    {t("WelcomeBack")}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    {t("enterYourDetailsBelow")}
                  </Typography>
                </Box>

                <Box component="form" sx={{ width: '100%' }}>
                  <Box sx={{ mb: 3 }}>
                    <StyledTextField
                      fullWidth
                      label={t("Email")}
                      type="email"
                      value={stateData.email}
                      onChange={(event) => {
                        setStateData({ ...stateData, email: event.target.value });
                      }}
                      onBlur={(event) => {
                        onBlur(event, "email");
                      }}
                      error={stateData.emailError === false}
                      helperText={stateData.emailError === false ? t("InvalidEmail") : ""}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <StyledTextField
                      fullWidth
                      label={t("Password")}
                      type={showPassword ? "text" : "password"}
                      value={stateData.password}
                      onChange={(event) => {
                        setStateData({
                          ...stateData,
                          password: event.target.value,
                        });
                      }}
                      onBlur={(event) => {
                        onBlur(event, "password");
                      }}
                      error={stateData.passwordError === false}
                      helperText={stateData.passwordError === false ? t("InvalidPassword") : ""}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ 
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.1)' }
                              }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked sx={{ 
                        '&.Mui-checked': { color: '#f28821' } 
                      }} />}
                      label={t("RememberMe")}
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                    />
                    <Link
                      href="/#/auth/reset"
                      sx={{
                        textDecoration: 'none',
                        color: '#f28821',
                        fontWeight: 500,
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: '#b95115',
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      {t("ForgotYourPassword")}
                    </Link>
                  </Box>

                  <AnimatedButton
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={loginFunc}
                    sx={{ mb: 3 }}
                  >
                    {t("Login")}
                  </AnimatedButton>

                  {stateData.error && (
                    <Fade in>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          borderRadius: '12px',
                          animation: `${fadeInUp} 0.3s ease-out`
                        }}
                      >
                        {stateData.error}
                      </Alert>
                    </Fade>
                  )}
                </Box>
              </LoginCard>
            </FormSection>
          </Grid>
        </Grid>
      </Container>
    </LoginContainer>
  );
};

export default withTranslation()(Login);
