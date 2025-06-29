import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import {
  Box,
  Alert,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Container,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { useMutation, gql } from "@apollo/client";
import { ownerLogin } from "../apollo";
import { validateFunc } from "../constraints/constraints";

const LOGIN = gql`
  ${ownerLogin}
`;

// Styled Components
const LoginContainer = styled(Box)(() => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #fef7ed 0%, #fff7ed 100%)',
  display: 'flex',
}));

const LeftSection = styled(Box)(() => ({
  flex: 1,
  padding: '80px 60px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const RightSection = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
}));

const LoginCard = styled(Paper)(() => ({
  padding: '48px',
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: 'none',
  width: '100%',
  maxWidth: '400px',
}));

const BrandTitle = styled(Typography)(() => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  marginBottom: '16px',
  lineHeight: 1.1,
}));

const BrandSubtitle = styled(Typography)(() => ({
  fontSize: '1.125rem',
  color: '#6b7280',
  marginBottom: '48px',
}));

const FeatureList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const FeatureItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const FeatureDot = styled(Box)(({ color }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0,
}));

const FoodEmojis = styled(Box)(() => ({
  display: 'flex',
  gap: '16px',
  marginBottom: '32px',
  fontSize: '2rem',
}));

const StyledTextField = styled(TextField)(() => ({
  marginBottom: '24px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ea580c',
      }
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#ea580c',
    }
  }
}));

const LoginButton = styled(Button)(() => ({
  backgroundColor: '#ea580c',
  color: 'white',
  padding: '12px 0',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  marginBottom: '24px',
  '&:hover': {
    backgroundColor: '#dc2626',
  }
}));

const UserIcon = styled(Box)(() => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#ea580c',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
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
      <LeftSection>
        <BrandTitle>
          Welcome to <br />
          <span style={{ color: '#ea580c' }}>HeartAttack</span>
        </BrandTitle>
        
        <BrandSubtitle>
          Enter your details below
        </BrandSubtitle>

        <FoodEmojis>
          <span>🍕</span>
          <span>🍔</span>
          <span>🍜</span>
          <span>🥗</span>
        </FoodEmojis>

        <FeatureList>
          <FeatureItem>
            <FeatureDot color="#10b981" />
            <Typography color="#6b7280">Fast & Reliable Delivery</Typography>
          </FeatureItem>
          <FeatureItem>
            <FeatureDot color="#ea580c" />
            <Typography color="#6b7280">Manage Your Restaurant</Typography>
          </FeatureItem>
          <FeatureItem>
            <FeatureDot color="#ef4444" />
            <Typography color="#6b7280">Track Orders in Real-time</Typography>
          </FeatureItem>
        </FeatureList>
      </LeftSection>

      <RightSection>
        <LoginCard elevation={0}>
          <UserIcon>
            <PersonOutlineIcon sx={{ color: 'white', fontSize: 24 }} />
          </UserIcon>

          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 600, 
            color: '#1f2937',
            marginBottom: '32px',
            fontSize: '1.5rem'
          }}>
            Login to HeartAttack
          </Typography>

          <Box component="form" sx={{ width: '100%' }}>
            <StyledTextField
              fullWidth
              label="Email"
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

            <StyledTextField
              fullWidth
              label="Password"
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
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={<Checkbox defaultChecked sx={{ 
                  '&.Mui-checked': { color: '#ea580c' } 
                }} />}
                label="Remember me"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px', color: '#6b7280' } }}
              />
              <Link
                href="/#/auth/reset"
                sx={{
                  textDecoration: 'none',
                  color: '#ea580c',
                  fontWeight: 500,
                  fontSize: '14px',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Forgot your password?
              </Link>
            </Box>

            <LoginButton
              fullWidth
              variant="contained"
              size="large"
              onClick={loginFunc}
            >
              🔑 Login
            </LoginButton>

            {stateData.error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '8px',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca'
                }}
              >
                {stateData.error}
              </Alert>
            )}
          </Box>
        </LoginCard>
      </RightSection>
    </LoginContainer>
  );
};

export default withTranslation()(Login);
