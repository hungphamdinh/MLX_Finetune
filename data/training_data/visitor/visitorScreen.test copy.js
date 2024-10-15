import React, { useEffect, useState } from 'react';
import Connect from '@stores';
import i18n from '@i18n';
import { DeviceEventEmitter } from 'react-native';
import AppList from '@components/Lists/AppList';
import BaseLayout from '../../components/Layout/BaseLayout';
import FilterView from '../../components/filterView';
import ItemVisitor from '../../components/ItemApp/ItemVisitor';
import { Modules } from '../../configs/constants';
import NavigationServices from '../../navigator/navigationServices';
import { icons } from '../../resources/icons';

const Visitor = ({ actions, visitor }) => {
  const list = visitor.list;

  const [visibleFilter, setVisibleFilter] = useState(false);

  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    actions.visitor.getListType();
    getList(1);
    const subscriber = DeviceEventEmitter.addListener('UpdateListVisitor', () => getList(1));
    return () => {
      subscriber.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = list;

  const getList = (page, keyword = textSearch) => {
    actions.visitor.getListVisitor('', page, keyword);
  };

  const onBtAddPress = () => {
    NavigationServices.navigate('AddVisitor');
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
    getList(1, text);
  };

  const gotoDetail = (item) => {
    NavigationServices.navigate('EditVisitor', {
      id: item.visitorId,
    });
  };

  const renderItem = (item) => <ItemVisitor item={item} onPress={() => gotoDetail(item, 1)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    emptyMsg: i18n.t('VS_EMPTY_TAB_CHECKIN'),
    iconName: icons.visitorEmpty,
    loadData: getList,
    keyExtractor: (item) => item.visitorId.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  return (
    <BaseLayout onBtAddPress={onBtAddPress} helpModuleId={Modules.VISITOR} title="VS_HEADER_MODULE">
      <FilterView
        onSearch={onTextSearchChange}
        visibleFilter={visibleFilter}
        setVisibleFilter={setVisibleFilter}
        searchPlaceHolder="VISITOR_PLACEHOLDER_SEARCH"
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default Connect(Visitor);
