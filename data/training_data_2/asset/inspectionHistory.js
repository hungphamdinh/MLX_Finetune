import React, { useEffect } from 'react';
import { View } from 'react-native';
import NavigationService from '@NavigationService';
import AppList from '@Components/Lists/AppList';
import useUser from '@Context/User/Hooks/UseUser';
import ItemInspectionHistory from '@Components/ItemApp/ItemInspectionHistory';
import useWorkflow from '@Context/Workflow/Hooks/UseWorkflow';
import { INSPECTION_STATUS } from '@Config/Constants';
import useAsset from '@Context/Asset/Hooks/UseAsset';

const InspectionHistory = () => {
  const {
    user: { user },
  } = useUser();

  const {
    workflow: { statusList },
  } = useWorkflow();

  const {
    asset: { assetDetail, inspectionsHistory },
    getInspectionsHistory,
  } = useAsset();

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = inspectionsHistory;

  useEffect(() => {
    loadData(1);
  }, []);

  const loadData = async (page = 1) => {
    const params = {
      page,
      orderByColumn: 0,
      isDescending: true,
      statusIds: statusList.find((item) => item.isIssueClosed && item.code === INSPECTION_STATUS.COMPLETED)?.id,
      assetId: assetDetail?.id,
    };
    getInspectionsHistory(params, user.id);
  };

  const renderItem = (item, index) => (
    <ItemInspectionHistory testID={`item-inspection-${index}`} item={item} onPress={() => gotoDetail(item)} />
  );

  const gotoDetail = (item) => {
    NavigationService.navigate('editJob', {
      id: item.id,
    });
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    loadData: ({ page }) => loadData(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item, index }) => renderItem(item, index),
  };

  return (
    <View style={{ flex: 1 }}>
      <AppList {...listProps} />
    </View>
  );
};

export default InspectionHistory;
