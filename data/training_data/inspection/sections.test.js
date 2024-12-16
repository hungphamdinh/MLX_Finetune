import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import Sections from '../Sections';

const list = [
  { id: '1', name: 'Section 1', formPages: [] },
  { id: '2', name: 'Section 2', formPages: [] },
];

const props = {
  list,
  updateField: jest.fn(),
  onRemoveSection: jest.fn(),
  formPages: [],
};

const renderSections = () => renderScreen(<Sections {...props} />)();

describe('Sections', () => {
  it('renders sections correctly', () => {
    const { getByText } = renderSections();

    expect(getByText('Section 1')).toBeTruthy();
    expect(getByText('Section 2')).toBeTruthy();
  });
});
