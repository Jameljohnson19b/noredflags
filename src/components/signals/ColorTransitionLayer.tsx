import React from 'react';
import { Animated, StyleSheet, ViewProps } from 'react-native';
import { useSignalColor } from '../../hooks/useSignalColor';

interface Props extends ViewProps {
  score: number;
  duration?: number;
}

/**
 * Animated View that bridges dynamic colors across sections of REDFLAGS.
 */
export function ColorTransitionLayer({ score, duration, style, children, ...rest }: Props) {
  const { animatedColor } = useSignalColor(score, duration || 750);

  return (
    <Animated.View
      style={[
        styles.layer,
        { backgroundColor: animatedColor },
        style,
      ]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
});
