import React from 'react';
import NavigationService from '@NavigationService';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ESignModal from './EsignModal';
import { JR_SIGN_TYPE } from '../../../Config/Constants';

describe('ESignModal', () => {
  beforeEach(() => {
    render(
      <ESignModal
        jrData={{
          signature: [
            {
              title: JR_SIGN_TYPE.OFFICE_SIGNING,
            },
            {
              title: JR_SIGN_TYPE.MAINTENANCE_SIGNING,
            },
          ],
        }}
        reloadData={jest.fn()}
      />
    );
  });
  const onSubmit = jest.fn();

  test('renders the ESignModal component', () => {
    expect(screen.queryByText('JR_E_SIGN_MODAL')).toBeTruthy();
  });

  test('renders with the correct title when signingVisible is true', () => {
    const data = [
      { id: 1, title: 'Option 1', isCheck: false },
      { id: 2, title: 'Option 2', isCheck: true },
    ];
    const title = 'JR_E_SIGN_MODAL';

    const { getByText } = render(<ESignModal onSubmit={onSubmit} data={data} title={title} />);

    const modalTitle = getByText(title);
    expect(modalTitle).toBeTruthy();
  });

  test('displays checkboxes based on the provided data', () => {
    const data = [
      {
        title: 'JR_E_SIGN_OFFICE',
        name: JR_SIGN_TYPE.OFFICE_SIGNING,
        isCheck: false,
        disabled: false,
        id: 1,
      },
      {
        title: 'JR_E_SIGN_MAINTENANCE',
        name: JR_SIGN_TYPE.MAINTENANCE_SIGNING,
        isCheck: true,
        disabled: false,
        id: 2,
      },
    ];
    const { getByText } = render(<ESignModal onSubmit={onSubmit} data={data} />);

    data.forEach((item) => {
      const checkboxLabel = getByText(item.title);
      expect(checkboxLabel).toBeTruthy();
    });
  });

  test('clicking on the onClosePress button hides the modal', () => {
    const mockSetVisibleSigningModal = jest.fn();
    ESignModal.prototype.setVisibleSigningModal = mockSetVisibleSigningModal;

    fireEvent.press(screen.getByTestId('closeButtonCheckBoxModal'));

    expect(mockSetVisibleSigningModal).toBeTruthy();
  });

  test('clicking on the "Sign" button navigates to the expected screen', () => {
    const jrData = {
      signature: [{
        displayName: 'John Doe'
      }],
    };
    const reloadData = jest.fn();

    const { getByTestId } = render(<ESignModal jrData={jrData} reloadData={reloadData} />);

    const signButton = getByTestId('buttonSign');

    fireEvent.press(signButton);

    expect(NavigationService.navigate).toHaveBeenCalledWith('commonSignature', {
      signingName: 'John Doe',
      disabledName: true,
      onSubmit: expect.any(Function),
    });
  });
});
