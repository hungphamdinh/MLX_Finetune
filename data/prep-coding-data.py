import csv
import random
import json

# Set the number of test and validation examples
num_test = 2
num_val = 2

# Extend your list of coding prompts and answers to ensure enough examples
coding_prompts = [
    "How do I write a unit test for a React Native component that renders a title?",
    "How can I test a button press in React Native?",
    "How do I check if a child component is rendered in React Native?",
    "What is the best way to mock functions in React Native unit tests?",
    "How can I simulate a navigation event in a React Native unit test?",
    "How do I verify a function is called when a button is pressed in React Native?",
    "How can I test conditional rendering in a React Native component?",
    "What is the best way to test state changes in React Native components?",
    "How do I mock async functions in React Native unit tests?",
    "How can I test the use of hooks like useEffect in React Native components?",
    # Additional prompts for more examples
    "How can I test list rendering in a React Native FlatList component?",
    "How do I test for component lifecycle methods in React Native?",
    "What is the best way to test form submission in React Native?",
    "How do I test navigation using React Navigation in React Native?",
    "How can I test context usage in React Native components?",
    "How do I verify that an API call is made when a component mounts in React Native?",
    "How can I mock third-party libraries in React Native unit tests?",
    "How do I test animated components in React Native?",
    "How can I test text input value changes in React Native?",
    "How do I handle testing components with hooks in React Native?",
    "Generate the unit test for item in listView",
    "Generate the unit test for item in listView",
    "Generate the unit test for item in listView",
    "Generate the unit test for item in listView",
    "Generate the unit test for item in listView"
]

coding_answers = [
    "To write a unit test for a React Native component that renders a title, you can use the `@testing-library/react-native` package. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('renders the title', () => {\n  const { getByText } = render(<MyComponent />);\n  expect(getByText('My Title')).toBeTruthy();\n});\n``` -CodeGPT",
    "To test a button press in React Native, use the `fireEvent` utility from `@testing-library/react-native`. Example:\n```javascript\nimport React from 'react';\nimport { fireEvent, render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('handles button press', () => {\n  const mockFn = jest.fn();\n  const { getByText } = render(<MyComponent onPress={mockFn} />);\n  fireEvent.press(getByText('Press me'));\n  expect(mockFn).toHaveBeenCalled();\n});\n``` -CodeGPT",
    "To check if a child component is rendered in React Native, you can use the `getByTestId` or `getByText` methods from `@testing-library/react-native`. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport ParentComponent from './ParentComponent';\nimport ChildComponent from './ChildComponent';\n\ntest('renders the child component', () => {\n  const { getByTestId } = render(<ParentComponent />);\n  expect(getByTestId('child-component')).toBeTruthy();\n});\n``` -CodeGPT",
    "To mock functions in React Native unit tests, you can use Jest's `jest.fn()` or `jest.mock()` utilities. Example:\n```javascript\nimport React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\nconst mockFn = jest.fn();\n\ntest('calls the mock function', () => {\n  const { getByText } = render(<MyComponent onPress={mockFn} />);\n  fireEvent.press(getByText('Press me'));\n  expect(mockFn).toHaveBeenCalled();\n});\n``` -CodeGPT",
    "To simulate a navigation event in a React Native unit test, you can mock the navigation prop using Jest. Example:\n```javascript\nimport React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('navigates on button press', () => {\n  const navigation = { navigate: jest.fn() };\n  const { getByText } = render(<MyComponent navigation={navigation} />);\n  fireEvent.press(getByText('Go to Details'));\n  expect(navigation.navigate).toHaveBeenCalledWith('Details');\n});\n``` -CodeGPT",
    "To verify that a function is called when a button is pressed in React Native, you can use Jest's `mockFn` along with `fireEvent`. Example:\n```javascript\nimport React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('calls function on button press', () => {\n  const mockFn = jest.fn();\n  const { getByText } = render(<MyComponent onPress={mockFn} />);\n  fireEvent.press(getByText('Press me'));\n  expect(mockFn).toHaveBeenCalled();\n});\n``` -CodeGPT",
    "To test conditional rendering in a React Native component, you can render the component with different props and check the output. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('renders conditionally', () => {\n  const { getByText, queryByText } = render(<MyComponent show={true} />);\n  expect(getByText('Shown')).toBeTruthy();\n  expect(queryByText('Hidden')).toBeNull();\n});\n``` -CodeGPT",
    "To test state changes in React Native components, you can trigger events that cause state changes and then verify the component's output. Example:\n```javascript\nimport React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('updates state on button press', () => {\n  const { getByText } = render(<MyComponent />);\n  fireEvent.press(getByText('Increment'));\n  expect(getByText('Count: 1')).toBeTruthy();\n});\n``` -CodeGPT",
    "To mock async functions in React Native unit tests, you can use Jest's `mockResolvedValue` or `mockRejectedValue`. Example:\n```javascript\nimport React from 'react';\nimport { render, waitFor } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('mocks async function', async () => {\n  const mockFetch = jest.fn().mockResolvedValue({ data: 'mockData' });\n  const { getByText } = render(<MyComponent fetchData={mockFetch} />);\n  await waitFor(() => expect(getByText('mockData')).toBeTruthy());\n});\n``` -CodeGPT",
    "To test the use of hooks like `useEffect` in React Native components, you can use `@testing-library/react-native` and mock the necessary effects. Example:\n```javascript\nimport React, { useEffect } from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('calls useEffect on mount', () => {\n  const effectMock = jest.fn();\n  useEffect.mockImplementation(effectMock);\n  render(<MyComponent />);\n  expect(effectMock).toHaveBeenCalled();\n});\n``` -CodeGPT",
    # Additional answers
    "To test list rendering in a React Native `FlatList` component, you can use `@testing-library/react-native` to check if the list items are rendered correctly. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyList from './MyList';\n\ntest('renders list items', () => {\n  const { getByText } = render(<MyList />);\n  expect(getByText('Item 1')).toBeTruthy();\n  expect(getByText('Item 2')).toBeTruthy();\n});\n``` -CodeGPT",
    "To test for component lifecycle methods in React Native, you can mock these methods using Jest and check if they are called. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('calls componentDidMount', () => {\n  jest.spyOn(MyComponent.prototype, 'componentDidMount');\n  render(<MyComponent />);\n  expect(MyComponent.prototype.componentDidMount).toHaveBeenCalled();\n});\n``` -CodeGPT",
    "To test form submission in React Native, simulate user input and form submission using `@testing-library/react-native`. Example:\n```javascript\nimport React from 'react';\nimport { fireEvent, render } from '@testing-library/react-native';\nimport MyForm from './MyForm';\n\ntest('handles form submission', () => {\n  const { getByPlaceholderText, getByText } = render(<MyForm />);\n  fireEvent.changeText(getByPlaceholderText('Enter name'), 'John Doe');\n  fireEvent.press(getByText('Submit'));\n  expect(getByText('Form submitted')).toBeTruthy();\n});\n``` -CodeGPT",
    "To test navigation using React Navigation in React Native, mock the navigation prop and check if the correct navigation functions are called. Example:\n```javascript\nimport React from 'react';\nimport { fireEvent, render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\ntest('navigates correctly', () => {\n  const navigation = { navigate: jest.fn() };\n  const { getByText } = render(<MyComponent navigation={navigation} />);\n  fireEvent.press(getByText('Go to Details'));\n  expect(navigation.navigate).toHaveBeenCalledWith('Details');\n});\n``` -CodeGPT",
    "To test context usage in React Native components, you can wrap the component with the context provider in your tests. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\nimport { MyContext } from './MyContext';\n\ntest('uses context value', () => {\n  const contextValue = { user: 'John Doe' };\n  const { getByText } = render(\n    <MyContext.Provider value={contextValue}>\n      <MyComponent />\n    </MyContext.Provider>\n  );\n  expect(getByText('Hello, John Doe')).toBeTruthy();\n});\n``` -CodeGPT",
    "To verify that an API call is made when a component mounts in React Native, mock the API call and check if it is invoked. Example:\n```javascript\nimport React, { useEffect } from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\n\njest.mock('axios');\nimport axios from 'axios';\n\ntest('makes API call on mount', () => {\n  axios.get.mockResolvedValue({ data: 'mockData' });\n  const { getByText } = render(<MyComponent />);\n  expect(getByText('mockData')).toBeTruthy();\n});\n``` -CodeGPT",
    "To mock third-party libraries in React Native unit tests, you can use Jest's `jest.mock()` function. Example:\n```javascript\njest.mock('react-native-fs', () => ({\n  readFile: jest.fn().mockResolvedValue('file content')\n}));\n\nimport React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\nimport { readFile } from 'react-native-fs';\n\ntest('mocks file read', async () => {\n  const { getByText } = render(<MyComponent />);\n  expect(await getByText('file content')).toBeTruthy();\n});\n``` -CodeGPT",
    "To test animated components in React Native, you can mock the animation API or use snapshot testing. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport AnimatedComponent from './AnimatedComponent';\n\ntest('renders animated component', () => {\n  const { toJSON } = render(<AnimatedComponent />);\n  expect(toJSON()).toMatchSnapshot();\n});\n``` -CodeGPT",
    "To test text input value changes in React Native, use the `fireEvent` method to simulate text input. Example:\n```javascript\nimport React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport MyTextInput from './MyTextInput';\n\ntest('handles text input', () => {\n  const { getByPlaceholderText } = render(<MyTextInput />);\n  fireEvent.changeText(getByPlaceholderText('Enter text'), 'New value');\n  expect(getByPlaceholderText('Enter text').props.value).toBe('New value');\n});\n``` -CodeGPT",
    "To handle testing components with hooks in React Native, you can mock the hooks and check if they behave as expected. Example:\n```javascript\nimport React from 'react';\nimport { render } from '@testing-library/react-native';\nimport MyComponent from './MyComponent';\nimport useCustomHook from './useCustomHook';\n\njest.mock('./useCustomHook');\n\nuseCustomHook.mockReturnValue('mocked value');\n\ntest('uses custom hook', () => {\n  const { getByText } = render(<MyComponent />);\n  expect(getByText('mocked value')).toBeTruthy();\n});\n``` -CodeGPT",
    "To generate the unit test for item in listview, you can follow this. Example:\n```import React from 'react';\nimport { renderScreen } from '__@mocks__/mockApp';\nimport EmptySliderItem from '../emptySliderItem';\n\ndescribe('EmptySliderItem', () => {\n  it('renders correctly', () => {\n    const { getByText, getByTestId } = renderScreen(<EmptySliderItem title={\"NOTICE_LIST_EMPTY_TITLE\"} content={\"NOTICE_LIST_EMPTY_CONTENT\"} />)();\n\n    expect(getByTestId('icon-bell')).toBeTruthy();\n    expect(getByText('NOTICE_LIST_EMPTY_TITLE')).toBeTruthy();\n    expect(getByText('NOTICE_LIST_EMPTY_CONTENT')).toBeTruthy();\n  });\n});``` -CodeGPT",
    "To generate the unit test for item in listview, you can follow this. Example:\n```import React from 'react';\nimport { fireEvent, render } from '@testing-library/react-native';\nimport PaymentMethodItem from '../../momo/momoPaymentMethod/ItemPaymentMethod';\n\ndescribe('PaymentMethodItem', () => {\n  const mockMethod = {\n    key: 'mockKey',\n    icon: 'mockIcon',\n    text: 'Mock Payment Method',\n  };\n\n  const mockOnSelect = jest.fn();\n\n  it('renders the payment method text', () => {\n    const { getByText } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);\n\n    expect(getByText(mockMethod.text)).toBeTruthy();\n  });\n\n  it('calls onSelect when pressed', () => {\n    const { getByText } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);\n\n    fireEvent.press(getByText(mockMethod.text));\n\n    expect(mockOnSelect).toHaveBeenCalledWith(mockMethod.key);\n  });\n\n  it('renders the radio button unchecked by default', () => {\n    const { queryByTestId } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);\n\n    expect(queryByTestId('radio-inner')).toBeFalsy();\n  });\n\n  it('renders the radio button checked when selected', () => {\n    const { getByTestId } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} isSelected />);\n\n    expect(getByTestId('radio-inner')).toBeTruthy();\n  });\n});``` -CodeGPT",
    "To generate the unit test for item in listview, you can follow this. Example:\n```import React from 'react';\nimport { fireEvent } from '@testing-library/react-native';\nimport { renderScreen } from '../../../../../__mocks__/mockApp';\nimport NoticeSliderItem from '../../noticeSlider/noticeSliderItem';\n\nconst mockItem = {\n  fileUrl: 'exampleImageUrl',\n  content: '<p>Sample content</p>',\n  subject: 'Sample Subject',\n};\n\nconst mockOnPress = jest.fn();\n\ndescribe('NoticeSliderItem', () => {\n  const renderItem = () => renderScreen(<NoticeSliderItem item={mockItem} onPress={mockOnPress} />)({ });\n\n  it('should render correctly', () => {\n    const { getByText } = renderItem();\n    const itemSubject = getByText('Sample Subject');\n    const itemContent = getByText('Sample content');\n    expect(itemSubject).toBeTruthy();\n    expect(itemContent).toBeTruthy();\n  });\n\n  it('should call onPress when notice is pressed', () => {\n    const { getByTestId } = renderItem();\n    const noticeOverlay = getByTestId('notice-overlay');\n    fireEvent.press(noticeOverlay);\n    expect(mockOnPress).toHaveBeenCalledTimes(1);\n  });\n});``` -CodeGPT",
    "To generate the unit test for item in listview, you can follow this. Example:\n```import React from 'react';\nimport { fireEvent } from '@testing-library/react-native';\nimport ItemOption from '../../landingPage/itemOption';\nimport { icons } from '../../../../resources/icons';\nimport { renderScreen } from '../../../../../__mocks__/mockApp';\n\nconst mockItem = {\n  id: 1,\n  icons: icons.selfRegistrationForm,\n  label: 'Test Label',\n};\n\nconst mockOnPressItem = jest.fn();\n\ndescribe('ItemOption', () => {\n  const renderItem = () => renderScreen(<ItemOption item={mockItem} onPressItem={mockOnPressItem} />)()\n\n  it('renders correctly', () => {\n    const { getByText, getByTestId } = renderItem();\n\n    const labelElement = getByText('Test Label');\n    expect(labelElement).toBeTruthy();\n\n    const touchableOpacityElement = getByTestId('item-option');\n    expect(touchableOpacityElement).toBeTruthy();\n\n    const imageViewElement = getByTestId('item-option-image');\n    expect(imageViewElement).toBeTruthy();\n  });\n\n  it('calls onPressItem when TouchableOpacity is pressed', () => {\n    const { getByTestId } = renderItem();\n\n    const touchableOpacityElement = getByTestId('item-option');\n    fireEvent.press(touchableOpacityElement);\n    expect(mockOnPressItem).toHaveBeenCalledWith(mockItem);\n  });\n});``` -CodeGPT",
    "To generate the unit test for item in listview, you can follow this. Example:\n```import React from 'react';\nimport { render, fireEvent } from '@testing-library/react-native';\nimport ItemVisitor from '../ItemVisitor';\n\ndescribe('ItemVisitor', () => {\n  const item = {\n    code: '1234',\n    createdAt: '2022-02-01T10:00:00.000Z',\n    numberOfVisitors: 2,\n    reasonForVisit: { name: 'Delivery' },\n    fullUnitId: 'Unit 123',\n    registerTime: '2022-02-01T10:30:00.000Z',\n    registerCheckOutTime: '2022-02-01T11:00:00.000Z',\n  };\n\n  it('renders the item code', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('#1234')).toBeDefined();\n  });\n\n  it('renders the date and time', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('01/02/2022')).toBeDefined();\n    expect(getByText('5:00 PM')).toBeDefined();\n  });\n\n  it('renders the number of visitors and reason for visit', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('2 VS_VISITORS')).toBeDefined();\n    expect(getByText('Delivery')).toBeDefined();\n  });\n\n  it('renders the check-in and check-out times', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('VS_IN: 17:30 01/02/2022')).toBeDefined();\n    expect(getByText('VS_OUT: 18:00 01/02/2022')).toBeDefined();\n  });\n\n  it('renders the unit ID', () => {\n    const { getByText } = render(<ItemVisitor item={item} />);\n    expect(getByText('Unit 123')).toBeDefined();\n  });\n\n  it('calls the onPress function when pressed', () => {\n    const onPress = jest.fn();\n    const { getByTestId } = render(<ItemVisitor item={item} onPress={onPress} />);\n    fireEvent.press(getByTestId('item-visitor'));\n    expect(onPress).toHaveBeenCalled();\n  });\n});``` -CodeGPT",

]


# New prompt format for coding helper
instructions_string = f"""You are a coding assistant, helping with programming problems in clear and concise language. Provide the best possible solution or explanation. End your responses with your signature '-CodeGPT'."""

example_template = lambda prompt, answer: f'''<s>[INST] {instructions_string} \n{prompt} \n[/INST]\n''' + answer + "</s>"

# Generate examples
example_list = []
for i in range(len(coding_prompts)):
    example = {"text": example_template(coding_prompts[i], coding_answers[i])}
    example_list.append(example)

# Now you have enough examples, you can create test and val data
test_val_index_list = random.sample(range(0, len(example_list)), num_test + num_val)

test_list = [example_list[index] for index in test_val_index_list[:num_test]]
val_list = [example_list[index] for index in test_val_index_list[num_test:]]

for example in test_list + val_list:
    example_list.remove(example)

# Write the train, test, and validation data to files
with open('train-coding.jsonl', 'w') as outfile:
    for example in example_list:
        json.dump(example, outfile)
        outfile.write('\n')

with open('test-coding.jsonl', 'w') as outfile:
    for example in test_list:
        json.dump(example, outfile)
        outfile.write('\n')

with open('valid-coding.jsonl', 'w') as outfile:
    for example in val_list:
        json.dump(example, outfile)
        outfile.write('\n')
