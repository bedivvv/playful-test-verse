
import React, { useState } from 'react';
import { 
  Box, 
  Alert, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  IconButton, 
  InputAdornment, 
  Link 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { withTranslation } from 'react-i18next';
import { 
  LoginCard, 
  StyledTextField, 
  LoginButton, 
  UserIcon 
} from './LoginStyles';

const LoginForm = ({ 
  stateData, 
  setStateData, 
  onBlur, 
  loginFunc, 
  t 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
  );
};

export default withTranslation()(LoginForm);
