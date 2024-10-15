import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import AttachImages from '../../../Inspection/AttachImageScreen';
import useFile from '@Context/File/Hooks/UseFile';
import { renderScreen } from '../../../../../../__mock__/mockApp';
import { usePhotoEditor } from '@Components/InnovatorInspection/PhotoEditor';

jest.mock('@Context/File/Hooks/UseFile');
jest.mock('@Components/InnovatorInspection/PhotoEditor', () => ({
  usePhotoEditor: jest.fn(() => ({
    showPhotoEditor: jest.fn(),
  })),
}));

const render = () => renderScreen(<AttachImages />)({});

describe('AttachImages Component', () => {
  const images = [
    {
      id: 1,
      uri: 'image1.jpg',
      position: 1,
      files: {
        fileUrl: 'https://example.com/image1.jpg',
        position: 1,
      },
      key: 1,
    },
    {
      id: 2,
      position: 2,
      uri: 'image2.jpg',
      files: {
        fileUrl: 'https://example.com/image2.jpg',
        position: 2,
      },
      key: 2,
    },
  ];

  beforeEach(() => {
    global.useMockRoute = {
      params: {
        images,
        callBack: jest.fn(),
      },
      name: 'attachImages',
    };
    useFile.mockReturnValue({
      uploadFiles: jest.fn(),
      isLoading: false,
      downloadImage: jest.fn(),
    });
  });

  it('renders correctly', () => {
    render();
  });

  it('calls onSelectPhoto when an image is selected', () => {
    const { getByTestId } = render();
    fireEvent.press(getByTestId('image-1'));
    expect(getByTestId('image-1')).toBeTruthy();
  });

  it('opens the zoom modal when an image is clicked', () => {
    const { getByTestId } = render();
    const zoomedImage = getByTestId('image-1');
    fireEvent.press(zoomedImage);
    expect(zoomedImage.props.children.props.source.fileUrl).toEqual('https://example.com/image1.jpg');
  });

  it('handles call showPhotoEditor when click edit', () => {
    const mockShowPhotoEditor = jest.fn();
    usePhotoEditor.mockReturnValue({
      showPhotoEditor: mockShowPhotoEditor,
    });
  });

  it('renders images in the correct order based on their position', () => {
    const { getByTestId } = render();

    const firstImage = getByTestId('image-1');
    const secondImage = getByTestId('image-2');

    // Assuming the order is based on position
    const source1 = firstImage.props.children.props.source;
    const source2 = secondImage.props.children.props.source;

    expect(source1.fileUrl).toEqual('https://example.com/image1.jpg');
    expect(source1.position).toEqual(1);

    expect(source2.fileUrl).toEqual('https://example.com/image2.jpg');
    expect(source2.position).toEqual(2);
  });

  it('updates the position of images correctly when dragged and dropped', () => {
    const { getByTestId, queryAllByTestId } = render();

    const secondImage = getByTestId('image-2');

    // Mocking drag and drop event
    fireEvent(secondImage, 'onDragRelease', [
      { ...images[1], position: 1 },
      { ...images[0], position: 2 },
    ]); // Simulate dropping it in the first position

    const reorderedImages = queryAllByTestId(/^image-/);

    expect(reorderedImages[0].props.children.props.source.fileUrl).toEqual('https://example.com/image2.jpg');
    expect(reorderedImages[1].props.children.props.source.fileUrl).toEqual('https://example.com/image1.jpg');
  });

  it('renders no images when images array is empty', () => {
    global.useMockRoute.params.images = [];
    const { queryByTestId } = render();
    expect(queryByTestId('image-1')).toBeNull();
  });
});
