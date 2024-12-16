// Pagination.jsx
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text } from '@components/Commons';
import { Colors } from '@themes';

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
`;

const PageButton = styled.TouchableOpacity`
  padding: 8px 12px;
  margin: 0 4px;
  background-color: ${({ active }) => (active ? Colors.primary : Colors.bgSecondary)};
  border-radius: 4px;
`;

const PageText = styled(Text)`
  color: ${({ active }) => (active ? Colors.textLight : Colors.textPrimary)};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
`;

const Pagination = ({ currentPage, totalPages, onPageChange, testID }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationContainer testID={testID}>
      {pages.map((page) => (
        <PageButton
          key={page}
          active={page === currentPage}
          onPress={() => onPageChange(page)}
          testID={`page-button-${page}`}
        >
          <PageText active={page === currentPage} text={page.toString()} />
        </PageButton>
      ))}
    </PaginationContainer>
  );
};

export default Pagination;