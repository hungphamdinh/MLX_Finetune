import React from 'react';
import AppList from '@components/Lists/AppList';
import styled from 'styled-components/native';
import { icons } from '@resources/icons';
import SliderHeader from '../sliderHeader';
import ItemDocument from '../../libraries/itemDocument';
import navigationServices from '../../../navigator/navigationServices';
import EmptySliderItem from '../emptySliderItem';

const Wrapper = styled.View`
  padding-bottom: 10px;
`;

const LibrarySlider = ({ list, downloadAndViewDocument }) => {
  const { data, isRefresh, currentPage, totalPage } = list;

  const onViewAll = () => {
    navigationServices.navigate('Library');
  };

  const onOpenDocument = (item) => {
    const file = item.file || {};
    downloadAndViewDocument(file.fileUrl, file.fileName);
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore: false,
    currentPage,
    totalPage,
    horizontal: true,
    directionalLockEnabled: true,
    style: {paddingHorizontal: 10},
    showsHorizontalScrollIndicator: false,
    ListEmptyComponent: <EmptySliderItem icon={icons.library} title="LIBRARY_EMPTY_LIST" />,
    loadData: () => {},
    keyExtractor: (item) => `${item.id}`,
    renderItem: ({ item }) => (
      <Wrapper>
        <ItemDocument isHomePage item={item} onPress={() => onOpenDocument(item)} />
      </Wrapper>
    ),
  };

  return (
    <SliderHeader onViewAll={onViewAll} title="LB_TITLEHEADER">
      <AppList testID="library-list" {...listProps} />
    </SliderHeader>
  );
};

export default LibrarySlider;
