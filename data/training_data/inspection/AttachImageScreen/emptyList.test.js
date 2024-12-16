import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyList from '../../../Inspection/AttachImageScreen/EmptyList';
import { ImageResource } from '../../../../../Themes';

describe('EmptyList Component', () => {
  it('renders correctly', () => {
    render(<EmptyList />);
  });

  it('renders image correctly', () => {
    const { getByTestId } = render(<EmptyList />);
    const image = getByTestId('image');
    expect(image.props.source).toBe(ImageResource.IMG_LIBRARY_EMPTY);
  });

  it('renders text correctly', () => {
    const { getByTestId } = render(<EmptyList />);
    const text = getByTestId('text');
    expect(text.props.children).toBe('AD_EFORM_NO_IMAGES_AVAILABLE');
  });
});
