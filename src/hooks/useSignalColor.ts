import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { getColorFromScore } from '../lib/scoring/colorMap';
import { Colors } from '../constants/colors';

/**
 * Hook to manage smooth color transitions based on the current signal score.
 * Color = Meaning.
 */
export function useSignalColor(score: number, duration: number = 750) {
  const targetColor = getColorFromScore(score);
  
  // Keep track of the previous color to animate from it
  const prevColorRef = useRef<string>(Colors.safe);
  const colorAnim = useRef(new Animated.Value(0)).current;

  // We need state to trigger a re-render so Interpolation updates with new previous/target
  const [colors, setColors] = useState({
    from: Colors.safe,
    to: targetColor
  });

  useEffect(() => {
    if (targetColor !== colors.to) {
      setColors({
        from: colors.to,
        to: targetColor
      });
      colorAnim.setValue(0);

      Animated.timing(colorAnim, {
        toValue: 1,
        duration,
        useNativeDriver: false, // color interpolation cannot use native driver
      }).start();
    }
  }, [score, targetColor, duration, colorAnim, colors.to]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.from, colors.to],
  });

  return { animatedColor, targetColor };
}
