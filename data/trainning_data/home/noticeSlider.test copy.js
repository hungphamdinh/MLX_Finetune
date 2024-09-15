import React from 'react';
import i18n from '@i18n';
import AppList from '@components/Lists/AppList';
import { View } from 'react-native';
import _ from 'lodash';
import NoticeSliderItem from './noticeSliderItem';
import NavigationServices from '../../../navigator/navigationServices';
import SliderHeader from '../sliderHeader';
import EmptySliderItem from '../emptySliderItem';

const NoticeSlider = ({ list }) => {
  const { data, isRefresh, currentPage, totalPage } = list;

  const onViewAllNotices = () => {
    NavigationServices.navigate('Inbox');
  };

  const renderItem = (item) => (
    <NoticeSliderItem
      item={item}
      onPress={() => {
        openModalDetail(item.id);
      }}
    />
  );


  const listProps = {
    data,
    isRefresh,
    isLoadMore: false,
    currentPage,
    totalPage,
    horizontal: true,
    directionalLockEnabled: true,
    showsHorizontalScrollIndicator: false,
    ListEmptyComponent: <EmptySliderItem title={'NOTICE_LIST_EMPTY_TITLE'} content={'NOTICE_LIST_EMPTY_CONTENT'} />,
    ItemSeparatorComponent: () => <View style={{ width: 10 }} />,
    ListHeaderComponent: () => <View style={{ width: 15 }} />,
    ListFooterComponent: () => <View style={{ width: 15 }} />,
    emptyMsg: i18n.t('NOTICES_EMPTY_MESSAGE'),
    loadData: () => {},
    keyExtractor: (item) => `${item.id}`,
    renderItem: ({ item }) => renderItem(item),
    contentContainerStyle: { marginTop: 10 },
  };

  const openModalDetail = (id) => {
    NavigationServices.navigate('DetailInbox', { id });
  };

  return (
    <SliderHeader title="NOTICES" onViewAll={onViewAllNotices}>
      <AppList testID="notice-list" {...listProps} />
    </SliderHeader>
  );
};

export default NoticeSlider;
