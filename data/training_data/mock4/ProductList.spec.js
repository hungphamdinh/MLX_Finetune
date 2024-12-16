// ProductList.test.jsx
import React from 'react';
import ProductList from '../ProductList';
import { render, waitFor } from '@testing-library/react-native';
import useProduct from '@Context/Product/Hooks/UseProduct';

// Mock External Dependencies
jest.mock('@Context/Product/Hooks/UseProduct');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); // To avoid warning about Animated

// Mock Functions
const mockGetProducts = jest.fn();

// Mock Data
const productsMock = [
  { id: 1, name: 'Product One', price: 10.0 },
  { id: 2, name: 'Product Two', price: 15.5 },
];

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useProduct Hook
  useProduct.mockReturnValue({
    products: productsMock,
    getProducts: mockGetProducts,
  });

  // Clear Mock Functions
  mockGetProducts.mockClear();
});

// Define Render Function
const renderComponent = () => render(<ProductList />);

// Write Test Cases
describe('ProductList Component', () => {
  it('fetches products on mount', async () => {
    renderComponent();

    // Wait for useEffect to finish
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalled());
  });

  it('renders product list correctly', async () => {
    const { getByTestId, getAllByText } = renderComponent();

    // Wait for products to be available
    await waitFor(() => expect(getByTestId('product-list')).toBeTruthy());

    // Verify that products are displayed
    expect(getAllByText(/Product/).length).toBe(2);
  });

  it('displays loading indicator when products are not available', () => {
    // Update the mock to return no products
    useProduct.mockReturnValue({
      products: null,
      getProducts: mockGetProducts,
    });

    const { getByText } = renderComponent();

    expect(getByText('Loading...')).toBeTruthy();
  });
});