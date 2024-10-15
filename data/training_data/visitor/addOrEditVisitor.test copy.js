import React from 'react';
import Connect from '@stores';
import _ from 'lodash';
import BaseLayout from '../../../components/Layout/BaseLayout';
import TabView from '../../../components/tabView';
import TabDetailInfo from './tabDetailInfo';
import TabPass from './tabPass';
import { useRoute } from '@react-navigation/native';

const AddOrEditVisitor = ({ navigation }) => {
  const route = useRoute();
  const isAddNew = route.name === 'AddVisitor';

  const baseLayoutProps = {
    showBell: false,
    title: isAddNew ? 'VS_NEW' : 'VS_EDIT',
  };

  const components = [
    {
      view: <TabDetailInfo navigation={navigation} />,
      label: 'VISITOR_DETAIL_INFO',
    },
  ];

  if (!isAddNew) {
    components.push({
      view: <TabPass navigation={navigation} />,
      label: 'VISITOR_PASS',
    });
  }

  return (
    <BaseLayout {...baseLayoutProps}>
      <TabView child={components} />
    </BaseLayout>
  );
};

export default Connect(AddOrEditVisitor);
