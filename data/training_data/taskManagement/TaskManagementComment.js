import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable, Text, KeyboardAvoidingView, SafeAreaView, Modal, FlatList, Platform } from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { FormProvider } from 'react-hook-form';
import { Colors } from '@Themes';
import { useCompatibleForm } from '@Utils/hook';
import useTaskManagement from '../../../Context/TaskManagement/Hooks/UseTaskManagement';
import { MessageFloatingButton } from '../../modalChat/FloatingConversation';
import FormMentionInput from '../../Forms/FormMentionInput';
import { icons } from '../../../Resources/icon';
import EmptyItem from '../../ContentChat/emptyItem';
import ItemChat from '../../ContentChat/ItemChat';
import useUser from '../../../Context/User/Hooks/UseUser';
import { transformMentionMessage } from '../../../Transforms/TaskMangementTransformer';
import { Metric } from '../../../Themes';
import { ControlOfficePrjId } from '../../../Config/Constants';

// Styled Components
const BodyWrapper = styled.View`
  background-color: ${Colors.bgMain};
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.bgMain};
`;

const HeaderWrapper = styled.View`
  height: 50px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex-direction: row;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const SuggestionView = styled.ScrollView`
  background-color: white;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  max-height: ${Metric.ScreenHeight / 3}px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
`;

const CloseIcon = styled.Image``;

const SendButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.disabled ? Colors.border : Colors.primary)};
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const TaskManagementComment = ({ task, teamList }) => {
  const { taskManagement, getCommentByTask, getMentionUsers, addComment } = useTaskManagement();
  const {
    user: { user, tenant },
  } = useUser();

  const { comments, mentionUsers } = taskManagement;
  const [visible, setVisible] = useState(false);

  const formMethods = useCompatibleForm({
    defaultValues: {
      comment: '',
    },
  });
  const { watch, handleSubmit, setValue } = formMethods;
  const { message } = watch();

  const getComments = useCallback(() => {
    if (task?.id) {
      getCommentByTask({ id: task.id });
    }
  }, [getCommentByTask, task?.id]);

  const onMentionInputChange = useCallback(
    (char) => {
      const isCOTeam = (teamId) => {
        const team = _.find(teamList, (team) => team.id === teamId);
        return team?.tenantId === ControlOfficePrjId;
      };
      const coTeamIds = task.teamIds.filter(isCOTeam);
      const siteTeamIds = task.teamIds.filter((teamId) => !isCOTeam(teamId));

      if (char && char.includes('') && mentionUsers.length === 0) {
        getMentionUsers({
          tenantId: task.tenantId,
          teamIds: siteTeamIds,
          teamCoIds: coTeamIds
        });
      }
    },
    [getMentionUsers, mentionUsers.length, task?.tenantId, task?.teamId]
  );

  const onSendMessage = useCallback(async () => {
    const { displayName, profilePictureId } = user;
    const content = transformMentionMessage(message);

    const params = {
      content,
      userName: displayName,
      profilePictureId,
      tenantId: tenant.id,
      taskId: task.id,
      creatorUserId: user.id,
    };

    setValue('message', '');
    await addComment(params);
    getComments();
  }, [message, user, tenant.id, task?.id, setValue, addComment, getComments]);

  const renderMentionSuggestions = useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      return (
        <SuggestionView>
          {mentionUsers
            .filter((item) => item.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
            .map((item) => (
              <Pressable key={item.id} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
                <Text>{item.name}</Text>
              </Pressable>
            ))}
        </SuggestionView>
      );
    },
    [mentionUsers]
  );

  const renderItem = useCallback(({ item, index }) => <ItemChat index={index} item={item} user={user} />, [user]);

  const keyExtractor = useCallback((item) => item.id || item.commentBoxId, []);

  useEffect(() => {
    if (visible) {
      getComments();
      onMentionInputChange();
    }
  }, [visible]);

  if (!task) {
    return null;
  }

  const disabled = _.size(message) === 0;

  return (
    <>
      <MessageFloatingButton testID="message-floating-button" onPress={() => setVisible(true)} />
      <Modal visible={visible}>
        <SafeAreaView />
        <Container>
          <HeaderWrapper>
            <CloseButton onPress={() => setVisible(false)}>
              <CloseIcon source={icons.closeBlack} />
            </CloseButton>
            <Text preset="medium">{`# ${task.name}`}</Text>
          </HeaderWrapper>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={64}
          >
            <FormProvider {...formMethods}>
              <BodyWrapper>
                <FlatList
                  style={{ flex: 1 }}
                  inverted={comments.length !== 0}
                  data={comments}
                  removeClippedSubviews={false}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  ListEmptyComponent={EmptyItem}
                />
                <FormMentionInput
                  required
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(onSendMessage)}
                  placeholder="AD_CHAT_WO_PLACEHOLDER"
                  name="message"
                  renderMentionSuggestions={renderMentionSuggestions}
                  onChange={onMentionInputChange}
                  rightButton={
                    <SendButton onPress={handleSubmit(onSendMessage)} disabled={disabled}>
                      <Icon name="paper-plane" color={disabled ? 'gray' : 'black'} size={25} />
                    </SendButton>
                  }
                />
              </BodyWrapper>
            </FormProvider>
          </KeyboardAvoidingView>
        </Container>
      </Modal>
    </>
  );
};

export default TaskManagementComment;
