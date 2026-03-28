import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { ColorTransitionLayer } from './ColorTransitionLayer';

interface Props extends ViewProps {
  score: number;
  size?: number;
}

/**
 * A glowing orb that simply reflects the current risk state color.
 * Used for minimal headers or inline signal markers.
 */
export function SignalOrb({ score, size = 16, style, ...rest }: Props) {
  return (
    <ColorTransitionLayer 
       score={score}
       style={[
         styles.orb, 
         { width: size, height: size, borderRadius: size / 2 },
         style
       ]}
       {...rest}
    />
  );
}

const styles = StyleSheet.create({
  orb: {
    // Basic drop shadow to give it a glowing effect against black and white UI
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  }
});
