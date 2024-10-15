import React from 'react';
import { waitFor } from '@testing-library/react-native';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import useUser from '@Context/User/Hooks/UseUser';
import useFile from '@Context/File/Hooks/UseFile';
import useFeedback from '@Context/Feedback/Hooks/useFeedback';
import NavigationService from '@NavigationService';
import DetailTab from '../../AddOrEditAsset/DetailTab';
import { renderScreen } from '../../../../../__mock__/mockApp';

// 1. Mock External Dependencies First
jest.mock('@Context/Asset/Hooks/UseAsset');
jest.mock('@Context/User/Hooks/UseUser');
jest.mock('@Context/File/Hooks/UseFile');
jest.mock('@Context/Feedback/Hooks/useFeedback');

jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
}));
jest.mock('@Components/Forms', () => {
  // Require the mock components from the separate file
  const {
    FormInputMock,
    FormDateMock,
    FormLazyDropdownMock,
    FormRadioGroupMock,
    FormSwitchMock,
    FormDocumentPickerMock,
    FormMoneyInputMock,
    FormDisabledProviderMock,
  } = require('../../../../../__mock__/components/Forms'); // Adjust the path based on your project structure

  return {
    FormInput: ({ name, label, testID }) => <FormInputMock name={name} label={label} testID={testID} />,
    FormDate: ({ name, label, testID }) => <FormDateMock name={name} label={label} testID={testID} />,
    FormLazyDropdown: ({ name, label, testID }) => <FormLazyDropdownMock name={name} label={label} testID={testID} />,
    FormRadioGroup: ({ name, label, testID }) => <FormRadioGroupMock name={name} label={label} testID={testID} />,
    FormSwitch: ({ name, label, testID }) => <FormSwitchMock name={name} label={label} testID={testID} />,
    FormDocumentPicker: ({ name, label, testID }) => (
      <FormDocumentPickerMock name={name} label={label} testID={testID} />
    ),
    FormMoneyInput: ({ name, label, testID }) => <FormMoneyInputMock name={name} label={label} testID={testID} />,
    FormDisabledProvider: ({ children }) => <FormDisabledProviderMock>{children}</FormDisabledProviderMock>,
  };
});

jest.mock('@Components/Forms/FormSuggestionPicker', () => {
  const { FormSuggestionPickerMock, SuggestionTypeMock } = require('../../../../../__mock__/components/Forms'); // Adjust the path based on your project structure

  return {
    __esModule: true, // Allows named exports
    default: ({ name, label, testID }) => <FormSuggestionPickerMock name={name} label={label} testID={testID} />,
    SuggestionTypes: SuggestionTypeMock,
  };
});

const mockGetAssetTypes = jest.fn();
const mockAddAsset = jest.fn();
const mockEditAsset = jest.fn();
const mockGetEmployees = jest.fn();
const mockGetFileReference = jest.fn();
const mockResetFiles = jest.fn();

const mockNavigateFn = NavigationService.navigate;

const assetTypesMock = {
  data: [
    { id: 'type-1', assetTypeName: 'Type 1' },
    { id: 'type-2', assetTypeName: 'Type 2' },
  ],
  isLoading: false,
  isRefreshing: false,
};

const employeesMock = {
  data: [
    { id: 'emp-1', displayName: 'Employee One' },
    { id: 'emp-2', displayName: 'Employee Two' },
  ],
  isLoading: false,
  isRefreshing: false,
};

const fileUrlsMock = [
  { id: 'file-1', url: 'http://example.com/file1.pdf' },
  { id: 'file-2', url: 'http://example.com/file2.pdf' },
];

const assetDetailMock = {
  assetName: 'Asset One',
  assetType: { id: 'type-1', assetTypeName: 'Type 1' },
  purchasedDate: '2023-01-01',
  price: 1000,
  serialNumber: 'SN123456',
  warrantDate: '2024-01-01',
  description: 'Description of Asset One',
  companyCode: 'COMP001',
  companyName: 'Company One',
  companyAddress: '1234 Street, City',
  companyPhone: '123-456-7890',
  code: 'CODE001',
  unitLocation: 'Unit A',
  inventoryBrand: { id: 'brand-1', name: 'Brand One' },
  locationType: [1],
  reminder: {
    isActive: true,
    users: [{ id: 'emp-1', displayName: 'Employee One' }],
    reminderDay: 5,
    emails: ['test@example.com'],
  },
  files: ['http://example.com/file1.pdf', 'http://example.com/file2.pdf'],
  assetCreationTime: '2023-01-01T10:00:00Z',
  model: 'Model X',
  referenceId: 'ref-123', // To determine isIMT
};

// 5. Set Up Mocks Before Each Test
beforeEach(() => {
  // Mock useAsset Hook
  useAsset.mockReturnValue({
    asset: {
      assetDetail: assetDetailMock, // Change to defaultAssetDetailMock for isAddNew=true
      assetTypes: assetTypesMock,
    },
    getAssetTypes: mockGetAssetTypes,
    addAsset: mockAddAsset,
    editAsset: mockEditAsset,
  });

  // Mock useUser Hook
  useUser.mockReturnValue({
    user: {
      employees: employeesMock,
    },
    getEmployees: mockGetEmployees,
  });

  // Mock useFile Hook
  useFile.mockReturnValue({
    file: {
      fileUrls: fileUrlsMock,
    },
    getFileReference: mockGetFileReference,
    resetFiles: mockResetFiles,
  });

  useFeedback.mockReturnValue({
    feedback: {
      qrFeedbackSetting: false,
    },
    getQrFeedbackSetting: jest.fn(),
  });

  // Clear Mock Functions
  mockGetAssetTypes.mockClear();
  mockAddAsset.mockClear();
  mockEditAsset.mockClear();
  mockGetEmployees.mockClear();
  mockGetFileReference.mockClear();
  mockResetFiles.mockClear();
  mockNavigateFn.mockClear();
});

// 6. Define Render Function
const renderComponent = (props = {}) => renderScreen(<DetailTab {...props} />)();

// 7. Write Test Cases
describe('DetailTab Component', () => {
  it('renders correctly', () => {
    const { getByText } = renderComponent();

    expect(getByText('AD_ASSETS_TITLE_ASSETSNAME')).toBeTruthy();
    expect(getByText('AD_ASSETS_TYPENAME')).toBeTruthy();
    expect(getByText('AD_ASSETS_CREATETIME')).toBeTruthy();
    expect(getByText('AD_ASSETS_TITLE_COMPANY')).toBeTruthy();
    expect(getByText('AD_ASSETS_COMPANY_CODE')).toBeTruthy();
    expect(getByText('AD_ASSETS_COMPANY_ADDRESS')).toBeTruthy();
    expect(getByText('AD_ASSETS_COMPANY_PHONE')).toBeTruthy();
    expect(getByText('AD_ASSETS_TITLE_INFO')).toBeTruthy();
    expect(getByText('MODEL')).toBeTruthy();
    expect(getByText('AD_ASSETS_SERI')).toBeTruthy();
    expect(getByText('AD_ASSETS_PURCHASE_DATE')).toBeTruthy();
    expect(getByText('AD_ASSETS_WARRANT_DATE')).toBeTruthy();
    expect(getByText('REMINDER')).toBeTruthy();
    expect(getByText('AD_ASSETS_TITLE_DES')).toBeTruthy();
    expect(getByText('COMMON_DOCUMENT')).toBeTruthy();
  });

  it('calls getAssetTypes on mount', async () => {
    renderComponent();

    await waitFor(() => {
      expect(mockGetAssetTypes).toHaveBeenCalledTimes(1);
    });

    expect(mockGetAssetTypes).toHaveBeenCalledWith({
      page: 1,
      keyword: '',
    });
  });

  it('initializes form with assetDetail data when not adding new', () => {
    const { getByText } = renderComponent();

    expect(getByText('AD_ASSETS_TITLE_ASSETSNAME')).toBeTruthy();
    expect(getByText('AD_ASSETS_TYPENAME')).toBeTruthy();
    expect(getByText('AD_ASSETS_CREATETIME')).toBeTruthy();
    expect(getByText('AD_ASSETS_TITLE_COMPANY')).toBeTruthy();
    expect(getByText('AD_ASSETS_COMPANY_CODE')).toBeTruthy();
    expect(getByText('AD_ASSETS_COMPANY_ADDRESS')).toBeTruthy();
    expect(getByText('AD_ASSETS_COMPANY_PHONE')).toBeTruthy();
    expect(getByText('AD_ASSETS_TITLE_INFO')).toBeTruthy();
    expect(getByText('MODEL')).toBeTruthy();
    expect(getByText('AD_ASSETS_SERI')).toBeTruthy();
    expect(getByText('AD_ASSETS_PURCHASE_DATE')).toBeTruthy();
    expect(getByText('AD_ASSETS_WARRANT_DATE')).toBeTruthy();
    expect(getByText('REMINDER')).toBeTruthy();
    expect(getByText('AD_ASSETS_TITLE_DES')).toBeTruthy();
    expect(getByText('COMMON_DOCUMENT')).toBeTruthy();
  });

  it('does not render ReadOnly fields when readOnly is false', () => {
    const { getByTestId } = renderComponent({ readOnly: false });

    expect(getByTestId('save-button')).toBeTruthy();
  });

  it('renders ReadOnly fields when readOnly is true', () => {
    const { queryByTestId } = renderComponent({ readOnly: true });

    expect(queryByTestId('save-button')).toBeNull();
  });

  it('resets files on unmount', () => {
    const { unmount } = renderComponent();

    unmount();

    expect(mockResetFiles).toHaveBeenCalledTimes(1);
  });
});
