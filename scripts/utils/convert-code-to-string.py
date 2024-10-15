def convert_code_to_string(code):
    # Convert the code into a string format
    code_string = "<code>" + code.replace("\n", "\\n").replace("\"", "\\\"") + "</code>"
    return code_string

if __name__ == "__main__":
    # Define the code snippet you want to convert
    code_snippet = """import React from 'react';
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
"""
    component_string = convert_code_to_string(code_snippet)

   # Print the output
print(component_string)
