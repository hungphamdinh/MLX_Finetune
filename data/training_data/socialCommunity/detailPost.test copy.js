import React, { useState, useEffect, Fragment, useRef } from 'react';
import Connect from '@stores';
import _ from 'lodash';
import AppList from '@components/Lists/AppList';
import styled from 'styled-components/native';
import { DeviceEventEmitter, KeyboardAvoidingView, View } from 'react-native';
import BaseLayout from '@components/Layout/BaseLayout';
import ItemPost from '@components/socialCommunity/itemPost';
import CommentInput from '@components/socialCommunity/commentInput';
import ItemPostComment from '@components/socialCommunity/itemPostComment';
import ActionModal, { useActionModalHook } from '@components/actionModal';
import PostMoreModal from '@components/socialCommunity/postMoreModal';
import AlertNative from '@components/AlertNative';
import i18n from '@i18n';
import Clipboard from '@react-native-clipboard/clipboard';
import toast from '@utils/toast';
import { SOCIAL_COMMUNITY_POST_STATUS } from '@configs/constants';
import PostRejected from './PostRejected';
import { useRoute } from '@react-navigation/native';
import { Text } from '@components/Commons';

const BottomSafeArea = styled.SafeAreaView`
  background-color: white;
  padding-top: 10px;
  padding-horizontal: 10px;
`;

const Input = styled(CommentInput)`
  margin-horizontal: 10px;
`;

const CommentWrapper = styled.View`
  padding-horizontal: 10px;
`;

const BlockView = styled.View`
  align-items: center;
  font-size: 15px;
`;

const DetailPost = ({ navigation, actions, userProfile: { user }, socialCommunity: { detailPost, comments } }) => {
  const moreActionModal = useActionModalHook();
  const commentActionModal = useActionModalHook();
  const {params} = useRoute();

  const [comment, setComment] = useState('');
  const [commentSelected, setCommentSelected] = useState(null);
  const [readyToScroll, setReadyToScroll] = useState(true);

  const listRef = useRef(null);
  const inputRef = useRef();

  const id = params?.id;
  const referenceId = params?.referenceId;
  const fromComment = params?.fromComment;

  const isPostOwner = user.id === detailPost?.creatorUserId;
  const isCommentOwner = user.id === commentSelected?.creatorUser?.id;
  let isPostRejected = true;
  if (detailPost) {
    isPostRejected = detailPost.statusId === SOCIAL_COMMUNITY_POST_STATUS.REJECTED;
  }

  const { data, isLoadMore, currentPage, totalPage } = comments;

  const combineLocalAndRemoteComment = () =>
    Object.values(
      data.reduce((acc, item) => {
        acc[item.id] = item; // last same id will overwrite the previous one
        return acc;
      }, {})
    );

  const listData = combineLocalAndRemoteComment();

  useEffect(() => {
    if (id) {
      actions.socialCommunity.detailPost(id);
      getComments();
    }
    const subscription = DeviceEventEmitter.addListener('ReloadListComment', getComments);
    return () => {
      subscription.remove();
      actions.socialCommunity.clearDetailPost();
    };
  }, [id]);

  useEffect(() => {
    if (fromComment) {
      inputRef.current?.focus();
    }
  }, [inputRef.current]);

  useEffect(() => {
    // Scroll to comment when navigate from Notification
    if (referenceId && _.size(data) > 0 && listRef.current && readyToScroll) {
      scrollToComment(referenceId);
      setReadyToScroll(false);
    }
  }, [referenceId, _.size(data), listRef.current]);

  const getComments = (page = 1) => {
    actions.socialCommunity.getPostComments({
      page,
      postId: id,
      pageSize: !referenceId ? 20 : 1000,
    });
  };

  const baseLayoutProps = {
    navigation,
    title: 'POST_DETAIL_TITLE',
    containerStyle: { backgroundColor: 'white' },
  };

  const itemPostProps = {
    item: detailPost,
    isDetail: true,
    onMorePress: () => {
      moreActionModal.showModal();
    },
    onComment: () => {
      inputRef.current.focus();
    },
  };

  const moreActionModalProps = {
    ...moreActionModal,
    item: detailPost,
  };

  const commentActionModalProps = {
    visible: commentActionModal.visible,
    setVisible: commentActionModal.showModal,
    onCloseModal: commentActionModal.hideModal,
    options: [
      {
        title: 'POST_COPY',
        icon: 'copy-outline',
        onPress: () => {
          Clipboard.setString(commentSelected.content);
          toast.showSuccess('COPY_SUCCESSFULLY');
        },
      },
    ],
  };
  if (isPostOwner || isCommentOwner) {
    commentActionModalProps.options.push({
      title: 'POST_DELETE',
      icon: 'trash-outline',
      onPress: () => {
        AlertNative(
          '',
          i18n.t('SC_DELETE_COMMENT_ASK'),
          () => actions.socialCommunity.deleteComment(commentSelected.id),
          i18n.t('AD_COMMON_YES'),
          i18n.t('AD_COMMON_CANCEL')
        );
      },
    });
  }

  const scrollToComment = (commentId) => {
    const index = listData.findIndex((item) => item.id === Number(commentId));
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const commentInputProps = {
    value: comment,
    onChangeText: setComment,
    onSubmit: () => {
      actions.socialCommunity.postComment({
        postId: id,
        content: comment,
        // handle Local Item
        creationTime: new Date(),
        creatorUser: user,
      });
      setComment('');
    },
    inputRef,
  };

  const renderItem = (item) => (
    <CommentWrapper>
      <ItemPostComment
        item={item}
        onLongPress={() => {
          commentActionModal.showModal();
          setCommentSelected(item);
        }}
      />
    </CommentWrapper>
  );
  const listHeaderComponent = React.useMemo(() => <ItemPost {...itemPostProps} />, [itemPostProps]);

  const onScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      listRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const listProps = {
    data: listData,
    isRefresh: false,
    isLoadMore,
    currentPage,
    totalPage,
    loadData: getComments,
    keyExtractor: (item) => item.id,
    renderItem: ({ item }) => renderItem(item),
    ListEmptyComponent: <View />,
    ListHeaderComponent: listHeaderComponent,
    listRef,
    onScrollToIndexFailed,
  };

  if (!detailPost) {
    return <BaseLayout {...baseLayoutProps} />;
  }

  return (
    <BaseLayout {...baseLayoutProps}>
      {isPostRejected ? (
        <PostRejected detailPost={detailPost} />
      ) : (
        <Fragment>
          <AppList {...listProps} />
          {!detailPost.isTurnOffComment ? (
            <KeyboardAvoidingView
              enabled
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              keyboardVerticalOffset={Platform.select({ ios: 140, android: 0 })}
            >
              <Input {...commentInputProps} />
            </KeyboardAvoidingView>
          ) : (
            <BlockView>
              <Text text="POST_COMMENT_BLOCK" />
            </BlockView>
          )}
          <BottomSafeArea />
          <ActionModal {...commentActionModalProps} />
          <PostMoreModal {...moreActionModalProps} />
        </Fragment>
      )}
    </BaseLayout>
  );
};

export default Connect(DetailPost);
