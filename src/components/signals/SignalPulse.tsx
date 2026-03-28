import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSignalColor } from '../../hooks/useSignalColor';

interface Props {
  score: number;
}

/**
 * Renders an animated pulse representing the dynamic shift in tension.
 * Higher scores drive faster, more intense scaling to indicate elevated risk.
 */
export function SignalPulse({ score }: Props) {
  const { animatedColor } = useSignalColor(score, 300);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    // Pulse faster for higher risk scores
    const speed = Math.max(200, 1500 - (score * 12)); 

    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.8, duration: speed, useNativeDriver: false }),
          Animated.timing(scaleAnim, { toValue: 1, duration: speed, useNativeDriver: false }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 0, duration: speed, useNativeDriver: false }),
          Animated.timing(opacityAnim, { toValue: 0.15, duration: speed, useNativeDriver: false }),
        ])
      ])
    );
    
    pulse.start();
    return () => pulse.stop();
  }, [score, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.pulse,
        {
          backgroundColor: animatedColor,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pulse: {
    width: 240,
    height: 240,
    borderRadius: 120,
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    zIndex: -1,
  }
});
