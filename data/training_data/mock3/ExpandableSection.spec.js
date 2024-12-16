// ExpandableSection.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import ExpandableSection from '../ExpandableSection';
import { Text } from '@components/Commons';

describe('ExpandableSection Component', () => {
  const renderSection = (props = {}) =>
    render(
      <ExpandableSection
        title="Section Title"
        testID="expandable-section"
        {...props}
      >
        <Text text="This is the content of the section." testID="section-content" />
      </ExpandableSection>
    );

  it('renders the header correctly', () => {
    const { getByText, getByTestId } = renderSection();
    expect(getByText('Section Title')).toBeTruthy();
    expect(getByTestId('expandable-section-header')).toBeTruthy();
  });

  it('does not display content initially', () => {
    const { queryByTestId } = renderSection();
    expect(queryByTestId('expandable-section-content')).toBeNull();
  });

  it('displays content when header is pressed', () => {
    const { getByTestId } = renderSection();
    const header = getByTestId('expandable-section-header');
    fireEvent.press(header);
    expect(getByTestId('expandable-section-content')).toBeTruthy();
    expect(getByTestId('section-content')).toBeTruthy();
  });

  it('hides content when header is pressed again', () => {
    const { getByTestId, queryByTestId } = renderSection();
    const header = getByTestId('expandable-section-header');

    // Expand
    fireEvent.press(header);
    expect(getByTestId('expandable-section-content')).toBeTruthy();

    // Collapse
    fireEvent.press(header);
    expect(queryByTestId('expandable-section-content')).toBeNull();
  });

  it('changes icon based on expanded state', () => {
    const { getByTestId, rerender } = renderSection();
    const header = getByTestId('expandable-section-header');
    const icon = header.findByType('Icon');

    // Initially collapsed
    expect(icon.props.name).toBe('chevron-down');

    // After expanding
    fireEvent.press(header);
    rerender(
      <ExpandableSection title="Section Title" testID="expandable-section">
        <Text text="This is the content of the section." testID="section-content" />
      </ExpandableSection>
    );
    expect(icon.props.name).toBe('chevron-up');
  });

  it('handles multiple instances independently', () => {
    const { getByTestId, queryByTestId } = render(
      <View>
        <ExpandableSection title="First Section" testID="section-1">
          <Text text="Content 1" testID="content-1" />
        </ExpandableSection>
        <ExpandableSection title="Second Section" testID="section-2">
          <Text text="Content 2" testID="content-2" />
        </ExpandableSection>
      </View>
    );

    const header1 = getByTestId('section-1-header');
    const header2 = getByTestId('section-2-header');

    // Expand first section
    fireEvent.press(header1);
    expect(getByTestId('section-1-content')).toBeTruthy();
    expect(queryByTestId('section-2-content')).toBeNull();

    // Expand second section
    fireEvent.press(header2);
    expect(getByTestId('section-2-content')).toBeTruthy();

    // Collapse first section
    fireEvent.press(header1);
    expect(queryByTestId('section-1-content')).toBeNull();
    expect(getByTestId('section-2-content')).toBeTruthy();
  });
});