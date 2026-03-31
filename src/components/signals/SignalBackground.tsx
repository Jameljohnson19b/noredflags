import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { ColorTransitionLayer } from './ColorTransitionLayer';
import { Colors } from '../../constants/colors';

interface Props extends ViewProps {
  score: number;
  opacityOverlay?: number;
}

/**
 * Creates atmospheric color wash behind the stark black and white foreground UI.
 */
export function SignalBackground({ score, opacityOverlay = 0.1, children, style, ...rest }: Props) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {/* Background is stark black */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.background }]} />
      
      {/* The transition layer is slightly washed out directly over black */}
      <ColorTransitionLayer score={score} duration={1200} style={{ opacity: opacityOverlay }} />
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
