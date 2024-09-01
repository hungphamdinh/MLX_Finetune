prompt_instruction = "Generate a unit test for these code. The code will start from <code-start> and end from <code-end>. "
answer_instruction = "To generate a unit test for your code you can follow this example"
signature = '-CodeGPT'

coding_prompts = [
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction,
    prompt_instruction
]

coding_answers = [
    answer_instruction + ":\n```import React from 'react';\nimport { renderScreen } from '@Mock/mockApp';\nimport EmptySliderItem from '../emptySliderItem';\n\ndescribe('EmptySliderItem', () => {\n  it('renders correctly', () => {\n    const { getByText, getByTestId } = renderScreen(<EmptySliderItem title='NOTICE_LIST_EMPTY_TITLE' content='NOTICE_LIST_EMPTY_CONTENT' />)();\n    expect(getByTestId('icon-bell')).toBeTruthy();\n    expect(getByText('NOTICE_LIST_EMPTY_TITLE')).toBeTruthy();\n    expect(getByText('NOTICE_LIST_EMPTY_CONTENT')).toBeTruthy();\n  });\n});",
    answer_instruction + ":\n```import React from 'react';\nimport { fireEvent, render } from '@testing-library/react-native';\nimport PaymentMethodItem from '../../momo/momoPaymentMethod/ItemPaymentMethod';\n\ndescribe('PaymentMethodItem', () => {\n  const mockMethod = { key: 'mockKey', icon: 'mockIcon', text: 'Mock Payment Method' };\n  const mockOnSelect = jest.fn();\n  it('renders the payment method text', () => {\n    const { getByText } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);\n    expect(getByText(mockMethod.text)).toBeTruthy();\n  });\n  it('calls onSelect when pressed', () => {\n    const { getByText } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);\n    fireEvent.press(getByText(mockMethod.text));\n    expect(mockOnSelect).toHaveBeenCalledWith(mockMethod.key);\n  });\n});",  
    answer_instruction + ":\n```import React from 'react';\nimport { fireEvent } from '@testing-library/react-native';\nimport { renderScreen } from '@Mock/mockApp';\nimport NoticeSliderItem from '../../noticeSlider/noticeSliderItem';\n\ndescribe('NoticeSliderItem', () => {\n  const mockItem = { fileUrl: 'exampleImageUrl', content: '<p>Sample content</p>', subject: 'Sample Subject' };\n  const mockOnPress = jest.fn();\n  it('renders correctly', () => {\n    const { getByText } = renderScreen(<NoticeSliderItem item={mockItem} onPress={mockOnPress} />)();\n    expect(getByText('Sample Subject')).toBeTruthy();\n    expect(getByText('Sample content')).toBeTruthy();\n  });\n  it('calls onPress when notice is pressed', () => {\n    const { getByTestId } = renderScreen(<NoticeSliderItem item={mockItem} onPress={mockOnPress} />)();\n    fireEvent.press(getByTestId('notice-overlay'));\n    expect(mockOnPress).toHaveBeenCalledTimes(1);\n  });\n});",
    answer_instruction + ":\n```import React from 'react';\nimport { fireEvent } from '@testing-library/react-native';\nimport ItemOption from '../../landingPage/itemOption';\nimport { icons } from '../../../../resources/icons';\nimport { renderScreen } from '@Mock/mockApp';\n\ndescribe('ItemOption', () => {\n  const mockItem = { id: 1, icons: icons.selfRegistrationForm, label: 'Test Label' };\n  const mockOnPressItem = jest.fn();\n  it('renders correctly', () => {\n    const { getByText, getByTestId } = renderScreen(<ItemOption item={mockItem} onPressItem={mockOnPressItem} />)();\n    expect(getByText('Test Label')).toBeTruthy();\n    expect(getByTestId('item-option')).toBeTruthy();\n    expect(getByTestId('item-option-image')).toBeTruthy();\n  });\n  it('calls onPressItem when TouchableOpacity is pressed', () => {\n    const { getByTestId } = renderScreen(<ItemOption item={mockItem} onPressItem={mockOnPressItem} />)();\n    fireEvent.press(getByTestId('item-option'));\n    expect(mockOnPressItem).toHaveBeenCalledWith(mockItem);\n  });\n});",    
    answer_instruction + ":\n```import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport ItemVisitor from '../ItemVisitor';\n\ndescribe('ItemVisitor', () => {\n  const item = { code: '1234', createdAt: '2022-02-01T10:00:00.000Z', numberOfVisitors: 2, reasonForVisit: { name: 'Delivery' }, fullUnitId: 'Unit 123', registerTime: '2022-02-01T10:30:00.000Z', registerCheckOutTime: '2022-02-01T11:00:00.000Z' };\n  it('renders the item code', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('1234')).toBeDefined();\n  });\n  it('renders the date and time', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('01/02/2022')).toBeDefined();\n    expect(getByText('5:00 PM')).toBeDefined();\n  });\n  it('renders the number of visitors and reason for visit', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('2 VS_VISITORS')).toBeDefined();\n    expect(getByText('Delivery')).toBeDefined();\n  });\n  it('renders the check-in and check-out times', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('VS_IN: 17:30 01/02/2022')).toBeDefined();\n    expect(getByText('VS_OUT: 18:00 01/02/2022')).toBeDefined();\n  });\n  it('renders the unit ID', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('Unit 123')).toBeDefined();\n  });\n  it('calls the onPress function when pressed', () => {\n    const onPress = jest.fn();\n    const { getByTestId } = render(<ItemVisitor item={item} onPress={onPress} />);\n    fireEvent.press(getByTestId('item-visitor'));\n    expect(onPress).toHaveBeenCalled();\n  });\n});",
    
    answer_instruction + ":\n```import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport ItemJR from '../ItemJR';\nimport { JR_STATUS_ID } from '../../../Config/Constants';\n\ndescribe('ItemJR', () => {\n  const mockItem = { id: 123, startDate: '2023-06-30T09:00:00.000Z', targetResponseDate: '2023-07-01T09:00:00.000Z', fullUnitCode: 'ABC123', haveOfficeSigning: true, haveMaintenanceSigning: false, statusId: JR_STATUS_ID.RESOLVED, isQuickCreate: false, description: 'Lorem ipsum dolor sit amet', teamUser: { displayName: 'John Doe' }, creatorUser: { displayName: 'Jane Smith' } };\n  const onPressMock = jest.fn();\n  const onPressSignMock = jest.fn();\n  const onPressPreviewMock = jest.fn();\n  afterEach(() => { jest.clearAllMocks(); });\n  it('should render the component correctly', () => {\n    const { getByText } = render(<ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />);\n    expect(getByText(`#${mockItem.id}`)).toBeTruthy();\n    expect(getByText('John Doe')).toBeTruthy();\n    expect(getByText('ABC123')).toBeTruthy();\n    expect(getByText('Lorem ipsum dolor sit amet')).toBeTruthy();\n    expect(getByText('COMMON_CREATION_TIME')).toBeTruthy();\n    expect(getByText('JR_TARGET_RESPONSE_DATE')).toBeTruthy();\n  });\n  it('should call the onPress function when the item is pressed', () => {\n    const { getByTestId } = render(<ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />);\n    fireEvent.press(getByTestId('item-wrapper'));\n    expect(onPressMock).toHaveBeenCalledTimes(1);\n  });\n  it('should call the onPressSign function when the sign button is pressed', () => {\n    const { getByTestId } = render(<ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />);\n    fireEvent.press(getByTestId('sign-button'));\n    expect(onPressSignMock).toHaveBeenCalledTimes(1);\n  });\n  it('should call the onPressPreview function when the preview button is pressed', () => {\n    const { getByTestId } = render(<ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />);\n    fireEvent.press(getByTestId('preview-button'));\n    expect(onPressPreviewMock).toHaveBeenCalledTimes(1);\n  });\n});", 
    answer_instruction + ":\n```import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport MyReportItem from '../MyReportItem';\nimport { formatDate } from '../../../Utils/transformData';\nimport LocaleConfig from '../../../Config/LocaleConfig';\n\ndescribe('MyReportItem', () => {\n  const mockItem = { id: '123', fileName: 'Report.pdf', creationTime: '2022-01-01T10:00:00.000Z', completionDate: '2022-01-02T10:00:00.000Z', file: { uri: 'path/to/file' }, statusId: 1 };\n  const mockOnItemPress = jest.fn();\n  const renderComponent = (item) => render(<MyReportItem item={item} onItemPress={mockOnItemPress} />);\n  it('renders correctly with a file', () => {\n    const { getByText } = renderComponent(mockItem);\n    expect(getByText(`#${mockItem.id}`)).toBeTruthy();\n    expect(getByText(mockItem.fileName)).toBeTruthy();\n    expect(getByText(formatDate(mockItem.creationTime, LocaleConfig.fullDateTimeFormat))).toBeTruthy();\n    expect(getByText(formatDate(mockItem.completionDate, LocaleConfig.fullDateTimeFormat))).toBeTruthy();\n    expect(getByText('COMPLETED')).toBeTruthy();\n  });\n  it('renders correctly without a file', () => {\n    const itemWithoutFile = { ...mockItem, file: null, statusId: 2 };\n    const { getByText } = renderComponent(itemWithoutFile);\n    expect(getByText(`#${mockItem.id}`)).toBeTruthy();\n    expect(getByText(mockItem.fileName)).toBeTruthy();\n    expect(getByText(formatDate(mockItem.creationTime, LocaleConfig.fullDateTimeFormat))).toBeTruthy();\n    expect(getByText(formatDate(mockItem.completionDate, LocaleConfig.fullDateTimeFormat))).toBeTruthy();\n    expect(getByText('FAILED')).toBeTruthy();\n  });\n  it('calls onItemPress when pressed and file is present', () => {\n    const { getByTestId } = renderComponent(mockItem);\n    fireEvent.press(getByTestId('report-item-button'));\n    expect(mockOnItemPress).toHaveBeenCalledWith(mockItem);\n  });\n  it('does not call onItemPress when file is null and TouchableOpacity is disabled', () => {\n    const itemWithoutFile = { ...mockItem, file: null };\n    const { getByTestId } = renderComponent(itemWithoutFile);\n    const reportItemButton = getByTestId('report-item');\n    expect(reportItemButton.props.disabled).toBe(true);\n  });\n});",  
    answer_instruction + ":\n```import React from 'react';\nimport { fireEvent, render } from '@testing-library/react-native';\nimport InspectionItem from './index';\n\ndescribe('InspectionItem', () => {\n  const mockOnItemPress = jest.fn();\n  const mockInspection = { property: { address: '123 Main St', name: 'Test Property', isActive: true } };\n  const mockWorkflow = { status: { name: 'Pending', colorCode: '#FFA500' }, subject: 'Test Inspection' };\n  it('renders the correct information', () => {\n    const { getByText } = render(<InspectionItem inspection={mockInspection} workflow={mockWorkflow} creationTime='2022-02-22T12:00:00Z' onItemPress={mockOnItemPress} syncState='synced' />);\n    expect(getByText('Test Inspection')).toBeTruthy();\n    expect(getByText('Test Property')).toBeTruthy();\n    expect(getByText('123 Main St')).toBeTruthy();\n    expect(getByText('Pending')).toBeTruthy();\n    expect(getByText('22/02/2022')).toBeTruthy();\n  });\n  it('calls onItemPress when pressed', () => {\n    const { getByTestId } = render(<InspectionItem inspection={mockInspection} workflow={mockWorkflow} creationTime='2022-02-22T12:00:00Z' onItemPress={mockOnItemPress} syncState='synced' />);\n    fireEvent.press(getByTestId('inspection-item'));\n    expect(mockOnItemPress).toHaveBeenCalled();\n  });\n});``` -CodeGPT",
    answer_instruction + "\n```import React from 'react';\nimport { render } from '@testing-library/react-native';\nimport { ItemVisitorDetail } from './index';\n\ndescribe('ItemVisitorDetail', () => {\n  const mockItem = { code: '12345', createdAt: '2022-02-22T10:30:00Z', fullUnitId: 'ABC123', username: 'Test User', numberOfVisitors: 2, visitorInformations: [{ id: '1', name: 'Visitor 1', phone: '123-456-7890', identityCardNumber: '123456' }, { id: '2', name: 'Visitor 2', phone: '123-456-7890', identityCardNumber: '123456' }], reasonForVisit: { id: '1', name: 'Business' }, description: 'Test visit', registerTime: '2022-02-20T10:00:00.000Z', registerCheckOutTime: '2022-02-20T12:00:00.000Z', checkInTimes: [{ id: '1', value: '2022-02-20T11:00:00.000Z' }], checkOutTimes: [{ id: '2', value: '2022-02-20T13:00:00.000Z' }] };\n  it('renders the correct number of visitor information sections', () => {\n    const { queryAllByTestId } = render(<ItemVisitorDetail item={mockItem} />);\n    expect(queryAllByTestId('user-wrapper')).toHaveLength(2);\n  });\n  it('renders the correct unit ID', () => {\n    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);\n    expect(queryByText('ABC123')).not.toBeNull();\n  });\n  it('renders the correct visitor reason of visit', () => {\n    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);\n    expect(queryByText('Business')).not.toBeNull();\n  });\n  it('renders the correct description', () => {\n    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);\n    expect(queryByText('Test visit')).not.toBeNull();\n  });\n  it('renders the actual check-in and check-out times correctly', () => {\n    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);\n    expect(queryByText('20/02/2022 18:00:00')).not.toBeNull();\n    expect(queryByText('20/02/2022 20:00:00')).not.toBeNull();\n  });\n});``` -CodeGPT",
    answer_instruction + ":\n```import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport ListHistory from './ListHistory';\nimport { mockUseInspection } from '../../../../jestSetup';\n\ndescribe('ListHistory', () => {\n  it('renders AppList component with correct props', () => {\n    const { getByTestId } = render(<ListHistory workflow={{}} />);\n    const appList = getByTestId('app-list');\n    expect(appList).toBeTruthy();\n    expect(appList.props.data).toEqual([]);\n    expect(appList.props.renderItem).toBeInstanceOf(Function);\n  });\n  it('calls getChangeHistories when component mounts', () => {\n    render(<ListHistory workflow={{}} />);\n    expect(mockUseInspection.getChangeHistories).toHaveBeenCalled();\n  });\n  it('calls getChangeHistories only once when component updates', () => {\n    const { rerender } = render(<ListHistory workflow={{}} />);\n    rerender(<ListHistory workflow={{}} />);\n    expect(mockUseInspection.getChangeHistories).toHaveBeenCalled();\n  });\n  it('calls getChangeHistories with correct parameters when loadData is invoked', () => {\n    const { getByTestId } = render(<ListHistory workflow={{ creationTime: '2023-06-14', form: { id: '123' } }} />);\n    const appList = getByTestId('app-list');\n    fireEvent(appList, 'loadData', { page: 2 });\n    expect(mockUseInspection.getChangeHistories).toHaveBeenCalledWith({ page: 2, fromDate: '2023-06-14', id: '123' });\n  });\n  it('returns correct key from the keyExtractor', () => {\n    const { getByTestId } = render(<ListHistory workflow={{}} />);\n    const appList = getByTestId('app-list');\n    const keyExtractor = appList.props.keyExtractor;\n    const item = { id: 'abc' };\n    const key = keyExtractor(item);\n    expect(key).toBe('abc');\n  });\n});",
    
    answer_instruction + ":\n```import React from 'react';\nimport { fireEvent, waitFor } from '@testing-library/react-native';\nimport MyReport from '../MyReport';\nimport useInspection from '@Context/Inspection/Hooks/UseInspection';\nimport MyReportItem from '@Components/InnovatorInspection/MyReportItem';\nimport { renderScreen } from '@Mock/mockApp';\nimport { TouchableOpacity, Text } from 'react-native';\n\njest.mock('@Context/Inspection/Hooks/UseInspection');\n\njest.mock('@Components/InnovatorInspection/MyReportItem', () => jest.fn(() => null));\n\nconst mockGetMyReports = jest.fn();\nconst mockViewMyReport = jest.fn();\nconst myReports = { data: [ { id: '1', fileName: 'Report1.pdf', creationTime: '2022-01-01T10:00:00.000Z', completionDate: '2022-01-02T10:00:00.000Z', file: { uri: 'path/to/file1' } }, { id: '2', fileName: 'Report2.pdf', creationTime: '2022-02-01T10:00:00.000Z', completionDate: '2022-02-02T10:00:00.000Z', file: { uri: 'path/to/file2' } } ], isLoadMore: false, isRefresh: false, currentPage: 1, totalPage: 1 };\n\nbeforeEach(() => {\n  useInspection.mockReturnValue({ getMyReports: mockGetMyReports, viewMyReport: mockViewMyReport, inspection: { myReports } });\n  mockGetMyReports.mockClear();\n  mockViewMyReport.mockClear();\n});\n\nconst render = () => renderScreen(<MyReport />)();\n\ndescribe('MyReport', () => {\n  it('renders correctly', () => {\n    render();\n  });\n  it('calls getMyReports on search', async () => {\n    const { getByPlaceholderText } = render();\n    const searchInput = getByPlaceholderText('MY_REPORT_SEARCH');\n    fireEvent.changeText(searchInput, 'test');\n    await waitFor(() => {\n      expect(mockGetMyReports).toHaveBeenCalledWith({ page: 1, keyword: 'test' });\n    });\n  });\n  it('calls viewMyReport when an item is pressed', () => {\n    MyReportItem.mockImplementation(({ item, onItemPress }) => (\n      <TouchableOpacity onPress={() => onItemPress(item)} testID={`report-item-${item.id}`}>\n        <Text>{item.fileName}</Text>\n      </TouchableOpacity>\n    ));\n    const { getByTestId } = render();\n    fireEvent.press(getByTestId('report-item-1'));\n    expect(mockViewMyReport).toHaveBeenCalledWith(myReports.data[0]);\n  });\n});",
    answer_instruction + "\n```import React from 'react';\nimport { fireEvent } from '@testing-library/react-native';\nimport AttachImages from '../../../Inspection/AttachImageScreen';\nimport useFile from '@Context/File/Hooks/UseFile';\nimport { renderScreen } from '../../../../../../__mock__/mockApp';\nimport { usePhotoEditor } from '@Components/InnovatorInspection/PhotoEditor';\n\njest.mock('@Context/File/Hooks/UseFile');\njest.mock('@Components/InnovatorInspection/PhotoEditor', () => ({\n  usePhotoEditor: jest.fn(() => ({\n    showPhotoEditor: jest.fn(),\n  })),\n}));\n\nconst render = () => renderScreen(<AttachImages />)({});\n\ndescribe('AttachImages Component', () => {\n  const images = [\n    {\n      id: 1,\n      uri: 'image1.jpg',\n      position: 1,\n      files: {\n        fileUrl: 'https://example.com/image1.jpg',\n        position: 1,\n      },\n      key: 1,\n    },\n    {\n      id: 2,\n      position: 2,\n      uri: 'image2.jpg',\n      files: {\n        fileUrl: 'https://example.com/image2.jpg',\n        position: 2,\n      },\n      key: 2,\n    },\n  ];\n\n  beforeEach(() => {\n    global.useMockRoute = {\n      params: {\n        images,\n        callBack: jest.fn(),\n      },\n      name: 'attachImages',\n    };\n    useFile.mockReturnValue({\n      uploadFiles: jest.fn(),\n      isLoading: false,\n      downloadImage: jest.fn(),\n    });\n  });\n\n  it('renders correctly', () => {\n    render();\n  });\n\n  it('calls onSelectPhoto when an image is selected', () => {\n    const { getByTestId } = render();\n    fireEvent.press(getByTestId('image-1'));\n    expect(getByTestId('image-1')).toBeTruthy();\n  });\n\n  it('opens the zoom modal when an image is clicked', () => {\n    const { getByTestId } = render();\n    const zoomedImage = getByTestId('image-1');\n    fireEvent.press(zoomedImage);\n    expect(zoomedImage.props.children.props.source.fileUrl).toEqual('https://example.com/image1.jpg');\n  });\n\n  it('handles call showPhotoEditor when click edit', () => {\n    const mockShowPhotoEditor = jest.fn();\n    usePhotoEditor.mockReturnValue({\n      showPhotoEditor: mockShowPhotoEditor,\n    });\n  });\n\n  it('renders images in the correct order based on their position', () => {\n    const { getByTestId } = render();\n\n    const firstImage = getByTestId('image-1');\n    const secondImage = getByTestId('image-2');\n\n    // Assuming the order is based on position\n    const source1 = firstImage.props.children.props.source;\n    const source2 = secondImage.props.children.props.source;\n\n    expect(source1.fileUrl).toEqual('https://example.com/image1.jpg');\n    expect(source1.position).toEqual(1);\n\n    expect(source2.fileUrl).toEqual('https://example.com/image2.jpg');\n    expect(source2.position).toEqual(2);\n  });\n\n  it('updates the position of images correctly when dragged and dropped', () => {\n    const { getByTestId, queryAllByTestId } = render();\n\n    const secondImage = getByTestId('image-2');\n\n    // Mocking drag and drop event\n    fireEvent(secondImage, 'onDragRelease', [\n      { ...images[1], position: 1 },\n      { ...images[0], position: 2 },\n    ]); // Simulate dropping it in the first position\n\n    const reorderedImages = queryAllByTestId(/^image-/);\n\n    expect(reorderedImages[0].props.children.props.source.fileUrl).toEqual('https://example.com/image2.jpg');\n    expect(reorderedImages[1].props.children.props.source.fileUrl).toEqual('https://example.com/image1.jpg');\n  });\n\n  it('renders no images when images array is empty', () => {\n    global.useMockRoute.params.images = [];\n    const { queryByTestId } = render();\n    expect(queryByTestId('image-1')).toBeNull();\n  });\n});\n```",
    answer_instruction + ":\n```import React from 'react';\nimport { renderScreen } from '@Mock/mockApp';\nimport Sections from '../Sections';\n\ndescribe('Sections', () => {\n  const list = [ { id: '1', name: 'Section 1', formPages: [] }, { id: '2', name: 'Section 2', formPages: [] } ];\n  const props = { list, updateField: jest.fn(), onRemoveSection: jest.fn(), formPages: [] };\n  it('renders sections correctly', () => {\n    const { getByText } = renderScreen(<Sections {...props} />)();\n    expect(getByText('Section 1')).toBeTruthy();\n    expect(getByText('Section 2')).toBeTruthy();\n  });\n});``` -CodeGPT",
    answer_instruction + ":\n```import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport SelectBottomTab from '../../../Inspection/AttachImageScreen/SelectBottomTab';\n\ndescribe('SelectBottomTab Component', () => {\n  const count = 2;\n  const onPressDelete = jest.fn();\n  const onSelectAll = jest.fn();\n  const renderBottomTab = (count = 2) => {\n    return render(<SelectBottomTab count={count} onPressDelete={onPressDelete} onSelectAll={onSelectAll} />);\n  };\n  it('renders correctly', () => {\n    render(<SelectBottomTab />);\n  });\n  it('calls onSelectAll when pressed', () => {\n    const { getByText } = renderBottomTab();\n    fireEvent.press(getByText('COMMON_SELECT_ALL'));\n    expect(onSelectAll).toHaveBeenCalledTimes(1);\n  });\n  it('calls onPressDelete when pressed', () => {\n    const { getByTestId } = renderBottomTab();\n    const deleteButton = getByTestId('delete-button');\n    fireEvent.press(deleteButton);\n    expect(onPressDelete).toHaveBeenCalledTimes(1);\n  });\n  it('renders correct text when count is 0', () => {\n    const { getByText } = renderBottomTab(0);\n    expect(getByText('COMMON_SELECT')).toBeTruthy();\n  });\n  it('renders correct text when count is greater than 0', () => {\n    const { getByText } = renderBottomTab();\n    expect(getByText('INSPECTION_PHOTO_SELECTED'.toUpperCase())).toBeTruthy();\n  });\n});``` -CodeGPT",
    answer_instruction + ":\n```import React from 'react';\nimport { render } from '@testing-library/react-native';\nimport EmptyList from '../../../Inspection/AttachImageScreen/EmptyList';\nimport { ImageResource } from '../../../../../Themes';\n\ndescribe('EmptyList Component', () => {\n  it('renders correctly', () => {\n    render(<EmptyList />);\n  });\n\n  it('renders image correctly', () => {\n    const { getByTestId } = render(<EmptyList />);\n    const image = getByTestId('image');\n    expect(image.props.source).toBe(ImageResource.IMG_LIBRARY_EMPTY);\n  });\n\n  it('renders text correctly', () => {\n    const { getByTestId } = render(<EmptyList />);\n    const text = getByTestId('text');\n    expect(text.props.children).toBe('AD_EFORM_NO_IMAGES_AVAILABLE');\n  });\n});\n",

]

coding_answers = [
    answer + f"\n{signature}" for answer in coding_answers
]