import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import AppList from '../../../Components/Lists/AppList';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import ItemJR from '../../../Components/ItemApp/ItemJR';
import { icons } from '../../../Resources/icon';
import useTeam from '../../../Context/Team/Hooks/UseTeam';
import useJobRequest from '../../../Context/JobRequest/Hooks/UseJobRequest';

const JobRequestTask = () => {
  const {
    jobRequest: { jrDetail, jrTasks },
    getTasksInJR,
    detailTask,
  } = useJobRequest();

  const { getUserInTeam } = useTeam();

  React.useEffect(() => {
    getList();
  }, []);

  React.useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('UpdateListTaskWorkOrder', getList);
    return () => {
      subscriber.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = jrTasks;

  const getList = () => {
    getTasksInJR(jrDetail.id);
  };

  const gotoDetail = (item) => {
    if (item.team) {
      getUserInTeam(item.team.id);
    }
    NavigationService.navigate('editJobRequestTask', {
      id: item.id,
    });
  };

  const renderItem = (item) => <ItemJR testID="item-jr" item={item} onPress={() => gotoDetail(item)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    emptyMsg: I18n.t('AD_IS_EMPTY_TEXT'),
    iconName: icons.jobRequestEmpty,
    loadData: getList,
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  return (
    <BaseLayout title="COMMON_TASK">
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default JobRequestTask;
