// ProgressBar.test.jsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '../ProgressBar';

describe('ProgressBar Component', () => {
  const renderProgressBar = (props = {}) =>
    render(
      <ProgressBar
        progress={50}
        label="Loading..."
        color="#FF5722"
        testID="progress-bar"
        {...props}
      />
    );

  it('renders progress bar container correctly', () => {
    const { getByTestId } = renderProgressBar();
    const container = getByTestId('progress-bar-container');
    expect(container).toBeTruthy();
    expect(container.props.style.width).toBe('100%');
    expect(container.props.style.height).toBe(20);
    expect(container.props.style.backgroundColor).toBe('#eee');
  });

  it('renders progress fill with correct width and color', () => {
    const { getByTestId } = renderProgressBar();
    const fill = getByTestId('progress-bar-fill');
    expect(fill).toBeTruthy();
    expect(fill.props.style.width).toBe('50%');
    expect(fill.props.style.backgroundColor).toBe('#FF5722');
  });

  it('renders label correctly when provided', () => {
    const { getByTestId } = renderProgressBar();
    const label = getByTestId('progress-bar-label');
    expect(label).toBeTruthy();
    expect(label.props.text).toBe('Loading...');
  });

  it('does not render label when not provided', () => {
    const { queryByTestId } = render(
      <ProgressBar progress={75} testID="progress-bar" />
    );
    expect(queryByTestId('progress-bar-label')).toBeNull();
  });

  it('handles progress values correctly', () => {
    const { getByTestId, rerender } = renderProgressBar({ progress: 30 });
    let fill = getByTestId('progress-bar-fill');
    expect(fill.props.style.width).toBe('30%');

    rerender(
      <ProgressBar
        progress={80}
        label="Almost done!"
        color="#2196F3"
        testID="progress-bar"
      />
    );
    fill = getByTestId('progress-bar-fill');
    expect(fill.props.style.width).toBe('80%');
    expect(fill.props.style.backgroundColor).toBe('#2196F3');
  });

  it('defaults to green color when no color prop is provided', () => {
    const { getByTestId } = render(
      <ProgressBar
        progress={60}
        label="Processing"
        testID="progress-bar-default"
      />
    );
    const fill = getByTestId('progress-bar-default-fill');
    expect(fill.props.style.backgroundColor).toBe('#4CAF50');
  });

  it('handles edge case of 0% progress', () => {
    const { getByTestId } = render(
      <ProgressBar
        progress={0}
        label="Not started"
        testID="progress-bar-zero"
      />
    );
    const fill = getByTestId('progress-bar-zero-fill');
    expect(fill.props.style.width).toBe('0%');
  });

  it('handles edge case of 100% progress', () => {
    const { getByTestId } = render(
      <ProgressBar
        progress={100}
        label="Completed"
        testID="progress-bar-full"
      />
    );
    const fill = getByTestId('progress-bar-full-fill');
    expect(fill.props.style.width).toBe('100%');
  });
});