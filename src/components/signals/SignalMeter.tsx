import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { useSignalColor } from '../../hooks/useSignalColor';
import { Colors } from '../../constants/colors';

interface Props {
  score: number;
  maxScore?: number;
}

/**
 * Visual meter tracking the risk score. Translates scale to color meaning.
 */
export function SignalMeter({ score, maxScore = 100 }: Props) {
  const { animatedColor } = useSignalColor(score);
  
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Clamp
    const clampedScore = Math.min(Math.max(score, 0), maxScore);
    const percentage = (clampedScore / maxScore) * 100;
    
    Animated.spring(widthAnim, {
      toValue: percentage,
      friction: 8,
      tension: 40,
      useNativeDriver: false, // Must be false for width percentages
    }).start();
  }, [score, maxScore, widthAnim]);

  return (
    <View style={styles.track}>
      <Animated.View 
        style={[
          styles.fill, 
          { 
             backgroundColor: animatedColor,
             width: widthAnim.interpolate({
               inputRange: [0, 100],
               outputRange: ['0%', '100%']
             })
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  }
});
