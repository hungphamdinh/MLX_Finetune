def convert_code_to_string(code):
    # Convert the code into a string format
    code_string = "<code>" + code.replace("\n", "\\n").replace("\"", "\\\"") + "</code>"
    return code_string

if __name__ == "__main__":
    # Define the code snippet you want to convert
    code_snippet = """import React from 'react';
import { renderScreen } from '__@mocks__/mockApp';
import ListDeviceSection from '../../deviceList/listDeviceSection';

describe('ListDeviceSection', () => {
  const deviceProps = {
    devices: [
      {
        id: 1,
        name: 'Device 1',
      },
      {
        id: 2,
        name: 'Device 2',
      },
    ],
  };

  const renderItem = (currentDeviceAmount, maxDeviceAmount) =>
    renderScreen(
      <ListDeviceSection
        title="Device List"
        currentDeviceAmount={currentDeviceAmount}
        maxDeviceAmount={maxDeviceAmount}
        refreshing={false}
        {...deviceProps}
      />
    )();

  it('renders the component with the correct title and device count', () => {
    const { getByText } = renderItem(2, 5);
    expect(getByText('Device List (2/5):')).toBeTruthy();
  });
});
"""
    component_string = convert_code_to_string(code_snippet)

   # Print the output
print(component_string)
