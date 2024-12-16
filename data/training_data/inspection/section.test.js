import React from 'react';
import { renderScreen, mockFormProvider } from '@Mock/mockApp';
import { fireEvent } from '@testing-library/react-native';
import Section from '../Sections/Section'; // Adjust the import path as necessary

jest.mock(
  '@Components/Forms/FormDropdown',
  () => 'FormDropdown',
  () => ({
    onChange: jest.fn(),
  })
);

const formPages = [
  {
    id: '1',
    name: 'section 1',
  },
  {
    id: '2',
    name: 'section 2',
  },
  {
    id: '3',
    name: 'section 3',
  },
];

const props = {
  updateField: jest.fn(),
  onRemoveSection: jest.fn(),
  item: { id: '1', formPages },
  list: [{ id: '1', formPages }],
  formPages: [{ id: 'page1', name: 'Page 1' }],
  name: 'sections',
  index: 0,
};
const SectionProvider = () => mockFormProvider(<Section {...props} />)({});

const renderSection = () => renderScreen(<SectionProvider />)();
describe('Section', () => {
  it('renders correctly', () => {
    renderSection();
  });

  it('Dropdown visible when click section button', () => {
    const { getByTestId } = renderSection();
    const sectionButton = getByTestId('sectionButton');
    fireEvent.press(sectionButton);
    expect(getByTestId('formDropdown')).toBeTruthy();
  });

  it('calls updateField with correct parameters on section select', () => {
    const { getByTestId } = renderSection();
    const sectionButton = getByTestId('sectionButton');
    fireEvent.press(sectionButton);
    fireEvent(getByTestId('formDropdown'), 'onChange', ['page1']);

    expect(props.updateField).toHaveBeenCalledWith(0, { formPages: ['page1'] });
  });
});
