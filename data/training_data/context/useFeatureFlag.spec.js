import { renderHook } from '@testing-library/react-hooks';
import useFeatureFlag from '@Context/useFeatureFlag';
import useApp from '@Context/App/Hooks/UseApp';

describe('useFeatureFlag', () => {
  it('should return isEnableLiveThere flag from general settings', () => {
    // Mock the implementation of useApp
    useApp.mockReturnValue({
      app: {
        allSettings: {
          general: {
            isEnableLiveThere: true,
          },
        },
      },
    });

    // Render the hook
    const { result } = renderHook(() => useFeatureFlag());

    // Assert the result
    expect(result.current.isEnableLiveThere).toBe(true);
  });

  it('should handle case when general settings are undefined', () => {
    // Mock the implementation of useApp with undefined general settings
    useApp.mockReturnValue({
      app: {
        allSettings: {},
      },
    });

    // Render the hook
    const { result } = renderHook(() => useFeatureFlag());

    // Assert the result
    expect(result.current.isEnableLiveThere).toBeUndefined();
  });
});
