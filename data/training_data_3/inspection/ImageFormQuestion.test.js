import React from 'react';
import { Alert } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { renderScreen } from '../../../../../../../__mock__/mockApp';
import ImageFormQuestion from '../../AddOrEditItemModal/DropdownQuestion/ImageFormQuestion';

jest.spyOn(Alert, 'alert');

describe('ImageFormQuestion Component', () => {
  const mockUpdateImageOptions = jest.fn();
  const mockItem = {
    id: 'item-1',
    image: { uri: 'https://example.com/image.jpg' },
  };
  const defaultProps = {
    item: mockItem,
    name: 'testName',
    allowDelete: true,
    updateImageOptions: mockUpdateImageOptions,
    iconStyle: { width: 100, height: 100 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const render = (props) => renderScreen(<ImageFormQuestion {...defaultProps} {...props} />)();

  it('renders the image with correct uri and styles', () => {
    const { getByTestId } = render(<ImageFormQuestion {...defaultProps} />);
    const imageUri = getByTestId('image-view');
    expect(imageUri).toBeTruthy();
    expect(imageUri.props.source.uri.uri).toEqual(mockItem.image.uri);
  });

  it('renders the delete button when allowDelete is true', () => {
    const { getByTestId } = render();
    // IconButton displays the name prop as text
    expect(getByTestId('close-circle')).toBeTruthy();
  });

  it('does not render the delete button when allowDelete is false', () => {
    const props = { ...defaultProps, allowDelete: false };
    const { queryByTestId } = render(props);
    expect(queryByTestId('close-circle')).toBeNull();
  });

  it('opens ImageZoomModal when image is pressed', () => {
    const { getByTestId, queryByText } = render();
    const imageTouchable = getByTestId('image-view');

    expect(queryByText('zoom-modal')).toBeNull();
    fireEvent.press(imageTouchable);
    expect(getByTestId('zoom-modal')).toBeTruthy();
  });

  it('shows an alert when delete button is pressed', () => {
    const { getByTestId } = render();
    const deleteButton = getByTestId('close-circle');

    fireEvent.press(deleteButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'COMMON_DELETE',
      'DOCUMENT_DELETE_ASK',
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'COMMON_DELETE',
          style: 'destructive',
          onPress: expect.any(Function),
        },
      ],
      { cancelable: true }
    );
  });

  it('calls updateImageOptions with correct arguments when deletion is confirmed', () => {
    const { getByTestId } = render(<ImageFormQuestion {...defaultProps} />);
    const deleteButton = getByTestId('close-circle');

    fireEvent.press(deleteButton);

    // Get the onPress function from the Alert
    const alertCalls = Alert.alert.mock.calls;
    expect(alertCalls.length).toBe(1);

    const onPressDelete = alertCalls[0][2][1].onPress;

    // Call the onPressDelete function to simulate user confirming deletion
    onPressDelete();

    expect(mockUpdateImageOptions).toHaveBeenCalledWith('item-1', null);
  });
});
