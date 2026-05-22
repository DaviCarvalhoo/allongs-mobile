import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  
  return (
    <View className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
      <View 
        className="h-full bg-primary rounded-full" 
        style={{ width: `${safePercentage}%` }} 
      />
    </View>
  );
}
