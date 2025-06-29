
import React from 'react';
import { Typography } from '@mui/material';
import { 
  LeftSection, 
  BrandTitle, 
  BrandSubtitle, 
  FoodEmojis, 
  FeatureList, 
  FeatureItem, 
  FeatureDot 
} from './LoginStyles';

const BrandSection = () => {
  return (
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
  );
};

export default BrandSection;
