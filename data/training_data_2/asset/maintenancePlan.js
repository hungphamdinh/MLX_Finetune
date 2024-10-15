import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import WhiteSegmentControl from '../../../../Components/WhiteSegmentControl';
import usePlanMaintenance from '../../../../Context/PlanMaintenance/Hooks/UsePlanMaintenance';
import ListPM from '../../../PlanMaintenance/ListPM';
import useAsset from '../../../../Context/Asset/Hooks/UseAsset';

const planType = {
  next: 0,
  history: 1,
};

const MaintenancePlan = ({ navigation, isHistory }) => {
  const [selectedIndex, setSelectedIndex] = useState(planType.next);

  const {
    getAssetsPlan,
    planMaintenance: { assetPlans },
  } = usePlanMaintenance();

  const {
    asset: { assetDetail },
  } = useAsset();

  useEffect(() => {
    getAssetsList();
  }, [assetDetail]);

  const getAssetsList = async (page = 1, idx = selectedIndex) => {
    const params = {
      assetIds: assetDetail.id,
      page,
      pageSize: 20,
    };
    if (!isHistory) {
      params.groupStatus = idx === planType.history ? 'HISTORY' : 'NEXT';
    }
    getAssetsPlan(params);
  };

  const onChangeSelectedIndex = (val) => {
    setSelectedIndex(val);
    getAssetsList(1, val);
  };

  return (
    <View style={{ flex: 1 }}>
      <ListPM isHistory={isHistory} navigation={navigation} data={assetPlans} getData={getAssetsList} />
      {!isHistory && (
        <SafeAreaView style={{ backgroundColor: '#FFF', alignItems: 'center' }}>
          <WhiteSegmentControl
            selectedIndex={selectedIndex}
            values={['AD_AS_NEXT', 'AD_AS_HISTORY']}
            onChange={onChangeSelectedIndex}
          />
        </SafeAreaView>
      )}
    </View>
  );
};

export default MaintenancePlan;
