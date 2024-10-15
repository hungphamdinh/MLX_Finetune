import React from 'react';
import RootChecker from '../RootChecker/index';
import { renderScreen } from '../../../__mock__/mockApp';

jest.mock('jail-monkey', () => ({
  isJailBroken: jest.fn(),
}));

renderRootChecker = () =>
  renderScreen(<RootChecker onCompleted={() => {}} />)({
    store: {},
    dispatch: jest.fn(),
  });

describe('RootChecker', () => {
  it('should render disclaimer modal if device is rooted and user has not agreed to disclaimer', () => {
    require('jail-monkey').isJailBroken.mockReturnValueOnce(true);

    const { getByText, debug } = renderRootChecker();
    debug();
    expect(getByText('ROOT_DISCLAIMER_CONTENT')).toBeDefined();
  });
  it('should not render disclaimer modal if device is not rooted', () => {
    require('jail-monkey').isJailBroken.mockReturnValueOnce(false);

    const { queryByText } = renderRootChecker();

    expect(queryByText('ROOT_DISCLAIMER_CONTENT')).toBeNull();
  });
});
