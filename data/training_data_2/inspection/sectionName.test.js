import React from 'react';
import { modal } from '@Utils';
import { fireEvent } from '@testing-library/react-native';
import { renderScreen, mockFormProvider } from '@Mock/mockApp';
import SectionName from '../Sections/SectionName';

jest.mock('@Context/User/Hooks/UseUser');

const item = {
  name: 'Master Section',
};

const props = {
  item,
  onRemoveSection: jest.fn(),
  index: 0,
  name: 'Master Section',
  updateField: jest.fn(),
};

const SectionsProvider = () => mockFormProvider(<SectionName {...props} />)({});

const render = () => renderScreen(<SectionsProvider />)();

describe('Section Name', () => {
  it('renders correctly', () => {
    const { getByText } = render();
    expect(getByText(item.name)).toBeTruthy();
  });

  it('allows toggling edit mode', () => {
    const { queryByText, getByTestId } = render();

    // Assume 'create-outline' is the role or text content for the edit button
    const editButton = getByTestId('buttonCreate', { name: /create-outline/i });
    fireEvent.press(editButton);

    // Check if the input appears
    const input = queryByText(item.name);
    expect(input).not.toBeTruthy(); // The name text should not be visible in edit mode

    const saveButton = getByTestId('buttonCreate', { name: /save-outline/i });
    expect(saveButton).toBeTruthy();
  });

  it('handles text change and saving correctly', () => {
    const { getByTestId } = render();
    fireEvent.press(getByTestId('buttonCreate', { name: /create-outline/i }));

    const input = getByTestId('textInput');
    fireEvent.changeText(input, 'New Section Name');

    fireEvent.press(getByTestId('buttonCreate', { name: /save-outline/i }));
    expect(props.updateField).toHaveBeenCalledWith(props.index, { name: 'New Section Name' });
  });

  it('removes section on remove button click', () => {
    const { getByTestId } = render();
    const removeButton = getByTestId('buttonRemove', { name: /close-circle/i });
    fireEvent.press(removeButton);
    expect(props.onRemoveSection).toHaveBeenCalledWith(props.index);
  });

  it('shows error when trying to save empty name', () => {
    const { getByTestId } = render();
    fireEvent.press(getByTestId('buttonCreate', { name: /create-outline/i }));

    const input = getByTestId('textInput');
    fireEvent.changeText(input, '');

    fireEvent.press(getByTestId('buttonCreate', { name: /save-outline/i }));

    expect(modal.showError).toHaveBeenCalledWith('FORM_THIS_FIELD_IS_REQUIRED');
  });
});
