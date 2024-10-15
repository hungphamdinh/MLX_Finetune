import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import i18n from '@i18n';
import Connect from '@stores';
import AppList from '@components/Lists/AppList';
import { View } from 'react-native';
import { size } from 'lodash';
import ItemPost from '@components/socialCommunity/itemPost';
import { Text } from '../../Commons';
import NavigationServices from '../../../navigator/navigationServices';
import { Metric } from '../../../themes';
import PostMoreModal from '../../socialCommunity/postMoreModal';
import { useActionModalHook } from '../../actionModal';
import SliderHeader from '../sliderHeader';

const PostWapper = styled(ItemPost)`
  width: ${Metric.ScreenWidth * 0.8};
  margin-top: 15px;
`;

const PostSlider = ({ actions, socialCommunity: { homePosts } }) => {
  const moreActionModal = useActionModalHook();
  const [selectedPost, setSelectedPost] = useState(null);
  const { data, isRefresh, isLoadMore, currentPage, totalPage } = homePosts;

  useEffect(() => {
    getList(1);
  }, []);

  const getList = (page) => {
    actions.socialCommunity.getListPost(page);
  };

  const gotoDetail = (item) => {
    NavigationServices.navigate('DetailPost', {
      id: item.id,
    });
  };

  const onViewAllPost = () => {
    NavigationServices.navigate('SocialCommunity');
  };

  const onMorePress = (item) => {
    moreActionModal.showModal();
    setSelectedPost(item);
  };

  const renderItem = (item) => {
    const postMaxLines = size(item.fileUrls) > 0 ? 1 : 10;
    return (
      <PostWapper
        item={item}
        onPress={() => gotoDetail(item)}
        onMorePress={onMorePress}
        hideSeeMore
        isHome
        maxLines={postMaxLines}
      />
    );
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    horizontal: true,
    directionalLockEnabled: true,
    showsHorizontalScrollIndicator: false,
    ListEmptyComponent: (
      <View>
        <Text>{i18n.t('POST_EMPTY_LIST')}</Text>
      </View>
    ),
    emptyMsg: i18n.t('POST_EMPTY_LIST'),
    loadData: getList,
    keyExtractor: (item) => `${item.id}`,
    renderItem: ({ item }) => renderItem(item),
  };

  const moreActionModalProps = {
    ...moreActionModal,
    item: selectedPost,
  };

  return size(data) ? (
    <SliderHeader title="SOCIAL_COMMUNITY_TITLE" onViewAll={onViewAllPost}>
      <AppList testID="post-list" {...listProps} />
      <PostMoreModal {...moreActionModalProps} />
    </SliderHeader>
  ) : null;
};

export default Connect(PostSlider);
