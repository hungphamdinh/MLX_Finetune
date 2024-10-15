import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import Visitor from '../index';
import { renderScreen } from '../../../../__mocks__/mockApp';
import NavigationServices from '../../../navigator/navigationServices';
import { mockList } from '../../../../__mocks__/mockStore';

describe('Visitor screen', () => {
  const renderVisitor = () => renderScreen(<Visitor />)();
  it('should render the screen title', () => {
    const { getByText } = renderVisitor();
    const title = getByText('VS_HEADER_MODULE');
    expect(title).toBeDefined();
  });

  it('should navigate to AddVisitor screen when the add button is pressed', () => {
    const navigateMock = jest.fn();
    jest.spyOn(NavigationServices, 'navigate').mockImplementation(navigateMock);
    const { getByTestId } = renderVisitor();
    // debug();
    const addButton = getByTestId('add-button');
    fireEvent.press(addButton);
    expect(navigateMock).toHaveBeenCalledWith('AddVisitor');
  });

  it('should navigate to EditVisitor screen when an item is pressed', () => {
    const navigateMock = jest.fn();
    jest.spyOn(NavigationServices, 'navigate').mockImplementation(navigateMock);
    const mockItem = {
      visitorId: 1,
    };
    const { getByTestId } = renderScreen(<Visitor />)({
      store: {
        visitor: {
          list: mockList([mockItem]),
        },
      },
    });
    const itemComponent = getByTestId('item-visitor');
    fireEvent.press(itemComponent);
    expect(navigateMock).toHaveBeenCalledWith('EditVisitor', { id: mockItem.visitorId });
  });
});
