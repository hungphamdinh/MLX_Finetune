import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ZoomControls from '../ZoomControl'; // Adjust the path as necessary

const TEST_IDS = {
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
  RESET: 'reset',
};

const zoomTests = [
  {
    description: 'Zoom In Button',
    testId: TEST_IDS.ZOOM_IN,
    previousZoom: 1,
    expectedZoom: 1.1,
    zoomFunction: (prev) => Math.min(prev + 0.1, 2),
  },
  {
    description: 'Zoom Out Button',
    testId: TEST_IDS.ZOOM_OUT,
    previousZoom: 1,
    expectedZoom: 0.9,
    zoomFunction: (prev) => Math.max(prev - 0.1, 0.5),
  },
];

// Helper function to render the component
const renderZoomControls = (setZoomLevelMock) => render(<ZoomControls setZoomLevel={setZoomLevelMock} />);

// Helper function to press a button
const pressButton = (getByTestId, testId) => {
  const button = getByTestId(testId);
  fireEvent.press(button);
};

describe('ZoomControls Component', () => {
  let setZoomLevelMock;

  beforeEach(() => {
    setZoomLevelMock = jest.fn();
  });

  it('renders all zoom buttons correctly', () => {
    const { getByTestId } = renderZoomControls(setZoomLevelMock);

    expect(getByTestId(TEST_IDS.ZOOM_IN)).toBeTruthy();
    expect(getByTestId(TEST_IDS.ZOOM_OUT)).toBeTruthy();
    expect(getByTestId(TEST_IDS.RESET)).toBeTruthy();
  });

  // Parameterized tests for Zoom In and Zoom Out buttons
  describe('Zoom In and Zoom Out Buttons', () => {
    zoomTests.forEach(({ description, testId, previousZoom, expectedZoom, zoomFunction }) => {
      it(`calls setZoomLevel correctly when ${description} is pressed`, () => {
        const { getByTestId } = renderZoomControls(setZoomLevelMock);

        pressButton(getByTestId, testId);

        // Expect setZoomLevel to be called with a function
        expect(setZoomLevelMock).toHaveBeenCalledWith(expect.any(Function));

        // Simulate the updater function with the previous zoom level
        const updaterFunction = setZoomLevelMock.mock.calls[0][0];
        const newZoomLevel = updaterFunction(previousZoom);
        expect(newZoomLevel).toBe(expectedZoom);
      });

      it(`does not exceed maximum zoom level when ${description} is pressed at max`, () => {
        // For Zoom In, test at maximum zoom
        if (description === 'Zoom In Button') {
          const { getByTestId } = renderZoomControls(setZoomLevelMock);
          pressButton(getByTestId, testId);

          // Simulate previous zoom level at max (2)
          const updaterFunction = setZoomLevelMock.mock.calls[0][0];
          const newZoomLevel = updaterFunction(2);
          expect(newZoomLevel).toBe(2); // Should not exceed 2
        }

        // For Zoom Out, test at minimum zoom
        if (description === 'Zoom Out Button') {
          const { getByTestId } = renderZoomControls(setZoomLevelMock);
          pressButton(getByTestId, testId);

          // Simulate previous zoom level at min (0.5)
          const updaterFunction = setZoomLevelMock.mock.calls[0][0];
          const newZoomLevel = updaterFunction(0.5);
          expect(newZoomLevel).toBe(0.5); // Should not go below 0.5
        }
      });
    });
  });

  it('calls setZoomLevel with 1 when Reset Zoom is pressed', () => {
    const { getByTestId } = renderZoomControls(setZoomLevelMock);

    const resetZoomButton = getByTestId(TEST_IDS.RESET);
    fireEvent.press(resetZoomButton);

    expect(setZoomLevelMock).toHaveBeenCalledWith(1);
  });
});
