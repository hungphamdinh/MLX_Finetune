import React from 'react';
import NavigationService from '@NavigationService';
import { render, fireEvent } from '@testing-library/react-native';
import { shallow } from 'enzyme';
import JobRequestTask from './';
import { mockUseJR, mockUseTeam } from '../../../../jestSetup';

describe('JobRequestTask', () => {
  it('should render the component without errors', () => {
    const wrapper = shallow(<JobRequestTask />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should call the getList function on component mount', () => {
    render(<JobRequestTask />);
    expect(mockUseJR.getTasksInJR).toHaveBeenCalled();
  });

  it('should navigate to editJobRequestTask screen when an item is pressed', () => {
    const { getByText } = render(<JobRequestTask />);
    const item = {
      id: 197,
      team: {
        allowAssignInspectionJob: false,
        creationTime: '2023-07-16T11:35:10.4871009Z',
        id: 2,
        isActive: false,
        memberCount: 0,
      },
    };
    fireEvent.press(getByText('test'), item);

    expect(mockUseTeam.getUserInTeam).toHaveBeenCalledWith(item.team.id);
    expect(NavigationService.navigate).toHaveBeenCalledWith('editJobRequestTask', { id: item.id });
  });
});
