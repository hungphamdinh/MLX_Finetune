import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import ItemJR from '../../../../Components/ItemApp/ItemJR';
import useJobRequest from '../../../../Context/JobRequest/Hooks/UseJobRequest';
import { icons } from '../../../../Resources/icon';
import NavigationService from '@NavigationService';
import { PAGE_SIZE } from '../../../../Config';
import Filter from '../../../../Components/Filter';
import AppList from '../../../../Components/Lists/AppList';
import useAsset from '../../../../Context/Asset/Hooks/UseAsset';

const defaultFilter = {
  multipleOptions: [],
};

const JobRequestHistory = () => {
  const {
    jobRequest: { jrHistorylist, statusList },
    getAssetJrHistory,
    getGroupCategories,
  } = useJobRequest();

  const filterData = {
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: statusList,
    },
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  const {
    asset: { assetDetail },
  } = useAsset();

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = jrHistorylist;

  useEffect(() => {
    getJrHistory(1);
    if (!_.size(statusList)) {
      getGroupCategories();
    }
  }, [selectedFilter]);

  const getJrHistory = (page = 1, keyword = '', filter = selectedFilter) => {
    const getData = getAssetJrHistory;
    let filterParams = {};
    filterParams = {
      statusIds: filter.statusIds,
      assetIds: assetDetail.id,
    };

    getData({
      page,
      pageSize: PAGE_SIZE,
      keyword,
      ...filterParams,
    });
  };

  const renderItem = (item, index) => (
    <ItemJR
      item={item}
      onPress={() => gotoDetail(item)}
      isShowSignBtn={false}
      isShowIRLinkage={false}
      isShowActiveStatus
      testID={`item-jr-${index + 1}`}
    />
  );

  const gotoDetail = (item) => {
    if (!item.isActive) {
      return;
    }
    NavigationService.navigate('editJobRequest', {
      id: item.id,
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    loadData: ({ page }) => getJrHistory(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item, index }) => renderItem(item, index),
  };

  return (
    <View style={{ flex: 1 }}>
      <Filter
        testID="filter-jr-history"
        data={filterData}
        defaultFilter={defaultFilter}
        selectedFilter={selectedFilter}
        onCompleted={onApplyFilter}
        customView={<View style={{ flex: 1 }} />}
      />
      <AppList {...listProps} />
    </View>
  );
};

export default JobRequestHistory;
