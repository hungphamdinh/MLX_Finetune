// ProfilePictureUploader.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import ProfilePictureUploader from '../ProfilePictureUploader';
import useUser from '@Context/User/Hooks/UseUser';
import { renderScreen } from '@Mock/mockApp';

// Mock External Dependencies
jest.mock('@Context/User/Hooks/UseUser');
jest.mock('@Elements', () => ({
  Button: ({ title, onPress, disabled, testID }) => (
    <button onClick={onPress} disabled={disabled} data-testid={testID}>
      {title}
    </button>
  ),
  Text: ({ text, color, testID }) => <span data-testid={testID} style={{ color }}>{text}</span>,
}));

describe('ProfilePictureUploader Component', () => {
  const mockUploadProfilePicture = jest.fn();
  const mockIsUploading = false;

  const mockUser = {
    avatar: 'http://example.com/avatar.png',
  };

  beforeEach(() => {
    useUser.mockReturnValue({
      user: mockUser,
      uploadProfilePicture: mockUploadProfilePicture,
      isUploading: mockIsUploading,
    });
    mockUploadProfilePicture.mockClear();
  });

  const renderComponent = (props = {}) => renderScreen(<ProfilePictureUploader {...props} />)();

  it('renders avatar and upload button correctly', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('uploader-avatar').props.source.uri).toBe(mockUser.avatar);
    expect(getByTestId('uploader-upload-button')).toBeTruthy();
  });

  it('calls uploadProfilePicture when upload button is pressed', () => {
    const { getByTestId } = renderComponent();
    fireEvent.press(getByTestId('uploader-upload-button'));
    expect(mockUploadProfilePicture).toHaveBeenCalledWith('new-avatar-url');
  });

  it('disables upload button while uploading', () => {
    useUser.mockReturnValue({
      user: mockUser,
      uploadProfilePicture: mockUploadProfilePicture,
      isUploading: true,
    });
    const { getByTestId } = renderComponent();
    const uploadButton = getByTestId('uploader-upload-button');
    expect(uploadButton.props.disabled).toBe(true);
    expect(uploadButton.props.title).toBe('Uploading...');
  });

  it('updates avatar after successful upload', () => {
    useUser.mockReturnValue({
      user: { avatar: 'http://example.com/new-avatar.png' },
      uploadProfilePicture: mockUploadProfilePicture.mockImplementation(() => {}),
      isUploading: false,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId('uploader-avatar').props.source.uri).toBe('http://example.com/new-avatar.png');
  });
});