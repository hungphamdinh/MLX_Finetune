// LoadingSpinner.test.jsx
import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from '../LoadingSpinner';
import { Colors } from '@themes';

describe('LoadingSpinner', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<LoadingSpinner testID="loading-spinner" />);
    const spinner = getByTestId('loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('applies correct size and color', () => {
    const { getByTestId } = render(
      <LoadingSpinner size="small" color={Colors.secondary} testID="loading-spinner" />
    );
    const spinner = getByTestId('loading-spinner').findByType('ActivityIndicator');
    expect(spinner.props.size).toBe('small');
    expect(spinner.props.color).toBe(Colors.secondary);
  });

  it('renders with transparent background when transparent prop is true', () => {
    const { getByTestId } = render(
      <LoadingSpinner transparent={true} testID="loading-spinner" />
    );
    const spinnerContainer = getByTestId('loading-spinner');
    expect(spinnerContainer.props.style.backgroundColor).toBe('rgba(0,0,0,0.3)');
  });

  it('renders with transparent background when transparent prop is false', () => {
    const { getByTestId } = render(
      <LoadingSpinner transparent={false} testID="loading-spinner" />
    );
    const spinnerContainer = getByTestId('loading-spinner');
    expect(spinnerContainer.props.style.backgroundColor).toBe('transparent');
  });
});