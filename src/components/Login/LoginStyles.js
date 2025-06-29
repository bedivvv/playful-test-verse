
import { styled } from "@mui/material/styles";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

export const LoginContainer = styled(Box)(() => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #fef7ed 0%, #fff7ed 100%)',
  display: 'flex',
}));

export const LeftSection = styled(Box)(() => ({
  flex: 1,
  padding: '80px 60px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export const RightSection = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
}));

export const LoginCard = styled(Paper)(() => ({
  padding: '48px',
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: 'none',
  width: '100%',
  maxWidth: '400px',
}));

export const BrandTitle = styled(Typography)(() => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  marginBottom: '16px',
  lineHeight: 1.1,
}));

export const BrandSubtitle = styled(Typography)(() => ({
  fontSize: '1.125rem',
  color: '#6b7280',
  marginBottom: '48px',
}));

export const FeatureList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

export const FeatureItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

export const FeatureDot = styled(Box)(({ color }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0,
}));

export const FoodEmojis = styled(Box)(() => ({
  display: 'flex',
  gap: '16px',
  marginBottom: '32px',
  fontSize: '2rem',
}));

export const StyledTextField = styled(TextField)(() => ({
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

export const LoginButton = styled(Button)(() => ({
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

export const UserIcon = styled(Box)(() => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#ea580c',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
}));
