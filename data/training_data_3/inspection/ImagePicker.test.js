// ImagePicker.test.js

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { generateGUID } from '@Utils/number';
import { openMultipleImagePicker } from '@Elements/ImagePicker';
import useForm from '@Context/Form/Hooks/UseForm';
import ImagePicker from '../../AddOrEditItemModal/DropdownQuestion/ImagePicker';

const mockUploadFileFormQuestionAnswers = jest.fn();
const mockResizedImages = [
  {
    uri: 'https://example.com/image1-uploaded.jpg',
    guid: 'mock-guid-123',
    // Include other properties if necessary
  },
];

jest.mock('@Elements', () => {
  const { TouchableOpacity, Text } = require('react-native');

  return {
    IconButton: ({ name, ...props }) => (
      <TouchableOpacity {...props}>
        <Text>{name}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('@Utils/number', () => ({
  generateGUID: jest.fn(),
}));

jest.mock('@Context/Form/Hooks/UseForm', () => ({
  __esModule: true,
  default: jest.fn(),
}));

useForm.mockReturnValue({
  uploadFileFormQuestionAnswers: mockUploadFileFormQuestionAnswers,
});

// Mocking the Alert.alert
jest.spyOn(Alert, 'alert');

describe('ImagePicker Component', () => {
  const mockUpdateImageOptions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useForm.mockReturnValue({
      uploadFileFormQuestionAnswers: mockUploadFileFormQuestionAnswers,
    });

    generateGUID.mockReturnValue('mock-guid-123');
    openMultipleImagePicker.mockResolvedValue(mockResizedImages);
    mockUploadFileFormQuestionAnswers.mockResolvedValue(mockResizedImages);
    jest.clearAllMocks();
  });

  const mockItem = {
    id: 'option-1',
    guid: 'item-guid-1',
  };

  const defaultProps = {
    item: mockItem,
    updateImageOptions: mockUpdateImageOptions,
  };

  const renderScreen = () => render(<ImagePicker {...defaultProps} />);

  it('renders the IconButton with correct props', () => {
    const { getByText } = renderScreen();
    const button = getByText('image');
    expect(button).toBeTruthy();
  });

  it('handles IconButton press - image selected', async () => {
    const { getByText } = render(<ImagePicker {...defaultProps} />);
    const button = getByText('image');

    await act(async () => {
      fireEvent.press(button);
    });

    expect(openMultipleImagePicker).toHaveBeenCalledWith({
      singleSelectedMode: true,
      usedCameraButton: true,
    });

    await waitFor(() => {
      expect(generateGUID).toHaveBeenCalled();
      expect(mockUploadFileFormQuestionAnswers).toHaveBeenCalledWith({
        referenceId: mockItem.guid,
        file: [
          {
            uri: 'https://example.com/image1-uploaded.jpg',
            guid: 'mock-guid-123',
          },
        ],
      });
      expect(mockUpdateImageOptions).toHaveBeenCalledWith('option-1', {
        uri: 'https://example.com/image1-uploaded.jpg',
        guid: 'mock-guid-123',
      });
      expect(mockUpdateImageOptions).toHaveBeenCalledTimes(1);
    });
  });

  it('handles IconButton press - no image selected', async () => {
    openMultipleImagePicker.mockResolvedValueOnce([]);

    const { getByText } = renderScreen();
    const button = getByText('image');

    await act(async () => {
      fireEvent.press(button);
    });

    expect(openMultipleImagePicker).toHaveBeenCalledWith({
      singleSelectedMode: true,
      usedCameraButton: true,
    });

    await waitFor(() => {
      expect(generateGUID).not.toHaveBeenCalled();
      expect(mockUploadFileFormQuestionAnswers).not.toHaveBeenCalled();
      expect(mockUpdateImageOptions).not.toHaveBeenCalled();
    });
  });

  it('handles upload failure gracefully', async () => {
    mockUploadFileFormQuestionAnswers.mockResolvedValueOnce(null);

    const { getByText } = renderScreen();
    const button = getByText('image');

    await act(async () => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(generateGUID).toHaveBeenCalled();

      // uploadFileFormQuestionAnswers should have been called
      expect(mockUploadFileFormQuestionAnswers).toHaveBeenCalledWith({
        referenceId: mockItem.guid,
        file: [
          {
            ...mockResizedImages[0],
            guid: 'mock-guid-123',
          },
        ],
      });

      expect(mockUpdateImageOptions).not.toHaveBeenCalled();
    });
  });
});
