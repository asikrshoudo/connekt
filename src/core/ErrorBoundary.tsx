import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { darkColors } from './theme/colors';
import { spacing } from './theme/spacing';
import { typography } from './theme/typography';

type Props = { children: ReactNode };
type State = { failed: boolean };

// Shows a message instead of a blank screen if rendering crashes.
// It logs nothing, so message content never ends up in logs.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={styles.root}>
        <Text style={[typography.heading, styles.title]}>Something went wrong</Text>
        <Text style={[typography.callout, styles.message]}>
          The screen could not be shown. You can try again.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try again"
          onPress={() => this.setState({ failed: false })}
          style={styles.button}
        >
          <Text style={[typography.headline, styles.buttonText]}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: darkColors.background,
  },
  title: { color: darkColors.textPrimary },
  message: { color: darkColors.textSecondary, textAlign: 'center' },
  button: {
    height: 50,
    paddingHorizontal: spacing.xl,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkColors.bubbleOutgoing,
  },
  buttonText: { color: darkColors.onAccent },
});
