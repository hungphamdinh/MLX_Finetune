import React, { Fragment, useEffect, useState } from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import styled from 'styled-components/native';
import { FormInput, FormDate, FormLazyDropdown, FormRadioGroup, FormDocumentPicker } from '@Forms';
import _ from 'lodash';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';
import {
  convertRemindersToReminder,
  transformParams,
  removeUnnecessaryProperties,
} from '@Transforms/TaskMangementTransformer';
import I18n from '@I18n';
import { parseDate } from '@Utils/transformData';
import Reminder from '@Components/Reminder';
import { useYupValidationResolver } from '@Utils/hook';
import { Box } from '@Elements';
import BaseLayout from '@Components/Layout/BaseLayout';
import useUser from '@Context/User/Hooks/UseUser';
import { FormDropdown } from '@Components/Forms';
import { FREQUENCIES } from '@Config/Constants';
import Row from '@Components/Grid/Row';
import useApp from '@Context/App/Hooks/UseApp';
import ButtonHint from '@Elements/ButtonHint';
import useTeam from '@Context/Team/Hooks/UseTeam';
import { ControlOfficePrjId } from '@Config/Constants';
import { useRoute } from '@react-navigation/native';
import useFile from '@Context/File/Hooks/UseFile';
import TaskManagementComment from '@Components/TaskManagement/TaskManagementComment';
import { FormDisabledProvider } from '@Components/Forms';
import { isGranted } from '@Config/PermissionConfig';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import useTenant from '@Context/Tenant/Hooks/UseTenant';
import { Linkages } from '@Elements';
import AddTaskButton from '@Components/JobRequests/AddTaskButton';
import { useCompatibleForm } from '@Utils/hook';
import { getDefaultTitleFromArr } from '../../../Utils/array';
import { MAX_TEXT_LENGTH } from '../../../Config/Constants';

const maximumRemindersAfter = 5;

const RowWrapper = styled(Row)`
  flex-wrap: wrap;
  justify-content: space-between;
`;

const DateWrapper = styled.View`
  width: 49%;
`;

const TaskLinkages = styled(Linkages)`
  margin-top: -5px;
  margin-bottom: 5px;
`

const TaskDetail = ({ navigation }) => {
  const {
    taskManagement: { priorityList, statusList, teamList, usersInTeams, taskDetail },
    getTaskDetail,
    addTask,
    updateTask,
    getUsersInTeamByTenants,
    getTeamsByTenant,
    resetTaskDetail
  } = useTaskManagement();

  const {
    app: { employeesByTenant },
    getEmployeesByTenant,
  } = useApp();
  
  const {
    user: { user },
  } = useUser();

  const {
    team: { teamsByUsers },
    getTeamsByUsers,
  } = useTeam();

  const {
    getTenantList,
    tenant: { tenantList },
  } = useTenant();

  const userTenant = useUser().user.tenant;

  const {
    getFileByReferenceId,
    file: { referenceFiles },
  } = useFile();

  const frequencyList = FREQUENCIES.map((item) => {
    item.name = I18n.t(item.name);
    return item;
  });

  const [allowReminderAfter, setAllowReminderAfter] = useState(true);
  const [allowReminderBefore, setAllowReminderBefore] = useState(true);

  const isReadOnly = !isGranted('TaskManagement.Update');
  
  const { params, name } = useRoute();
  const isAddNew = name === 'addTask';
  const isEdit = name === 'editTask';
  const isAddNewSubTask = name === 'addSubTask';
  const isEditSubTask = name === 'editSubTask';

  const id = params?.id;


  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(requiredMessage),
    description: Yup.string().required(requiredMessage),
    startDate: Yup.string().nullable().required(requiredMessage),
    endDate: Yup.string().nullable().required(requiredMessage),
    priorityId: Yup.number().nullable().required(requiredMessage),
    statusId: Yup.number().nullable().required(requiredMessage),
    teamIds: Yup.array().nullable().required(requiredMessage),
    assignees: Yup.array().min(1, requiredMessage),
    frequency: Yup.string().required(requiredMessage),
  });

  const initialValue = {
    name: '',
    description: '',
    startDate: undefined,
    endDate: undefined,
    priorityId: null,
    statusId: null,
    team: null,
    assignees: [],
    isNotification: false,
    frequency: '1',
    reminder: {
      isActive: true,
      reminderInMinutes: [],
      reminderInMinutesAfter: [],
      emails: [],
      userIds: [user.id],
      users: [user],
    },
    files: [],
    isTeamSelectionFirst: [true],
    isPublic: [false],
    taskAssigns: [],
    teamIds: [],
    tenant: userTenant,
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: initialValue,
  });

  const { setValue, watch } = formMethods;

  const [teamIds, assignees, reminder, tenant] = watch(['teamIds', 'assignees', 'reminder', 'tenant']);
  const isTeamSelectionFirst = _.first(watch('isTeamSelectionFirst'));
  const isPublic = _.first(watch('isPublic'));

  useEffect(() => {
    const initialize = () => {
      if (isEdit || isEditSubTask) {
        getTaskDetail(id);
        return;
      }
      return;
    };
    initialize();
    onChangeTenantId(tenant);
    return () => {
      resetTaskDetail();
    }
  }, []);

  useEffect(() => {
    formMethods.reset(getInitialValuesForUpdate());
  }, [taskDetail]);

  useEffect(() => {
    if (reminder?.isActive && _.size(assignees)) {
      const userIds = _.uniq([...assignees.map((item) => item.id, user.id)]);
      const users = _.uniqBy([...assignees, user], 'id');

      setValue('reminder', {
        ...reminder,
        users,
        userIds,
      });
    }
  }, [reminder?.isActive, _.size(assignees)]);

  useEffect(() => {
    if (!isAddNew && !isAddNewSubTask) {
      setValue('files', referenceFiles);
    }
  }, [_.size(referenceFiles)]);

  const getTitle = () => {
    if (isAddNew) {
      return 'ADD_TASK';
    }
    if (isEdit) {
      return 'EDIT_TASK';
    }
    if (isAddNewSubTask) {
      return 'ADD_SUB_TASK';
    }
    return 'EDIT_SUB_TASK';
  };

  const onChangeTenantId = (selectedTenant) => {
    if (isTeamSelectionFirst) {
      getTeamsByTenant({ tenantId: selectedTenant.id, isCO: isPublic });
      return;
    }
    getAssigneesByTenant(1, '', selectedTenant);
  };

  const resetTeamAssignee = (isTeamChoose, isCO = isPublic) => {
    setValue('teamIds', []);
    setValue('assignees', []);
    if (isTeamChoose) {
      getTeamsByTenant({ tenantId: tenant.id, isCO });
      return;
    }
    getAssigneesByTenant();
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew || isAddNewSubTask) {
      const subTaskInitValue = isAddNewSubTask ? {
        startDate: params.startDate,
        endDate: params.endDate,
        parentId: params.parentId,
        isPublic: [params.isPublic],
      } : {}

      return {
        ...initialValue,
        ...subTaskInitValue,
        statusId: statusList.find((item) => item.isDefault)?.id,
        priorityId: priorityList.find((item) => item.isDefault)?.id,
      };
    }

    if(taskDetail) {
      getFileByReferenceId(taskDetail.guid);
      if (taskDetail.isTeamSelectionFirst) {
        handleChangeAssignee(taskDetail.assignees);
        handleTeamChange(_.map(taskDetail.teams, (item) => item.id));
      } else {
        getAssigneesByTenant();
        handleChangeAssignee(taskDetail.assignees);
        fetchTeamsForAssignees(taskDetail.assignees);
      }
  
      return {
        ...taskDetail,
        startDate: parseDate(taskDetail.startDate),
        endDate: parseDate(taskDetail.endDate),
        reminder: convertRemindersToReminder(taskDetail.reminders || []),
        isTeamSelectionFirst: [taskDetail.isTeamSelectionFirst],
        isPublic: [taskDetail.isPublic],
        frequency: `${taskDetail.frequency}`,
        teamIds: _.map(taskDetail.teams, (item) => item.id),
        taskAssigns: watch('taskAssigns') || [],
      };
    }
   
  };

  const getAssigneesByTenant = async (page = 1, keyword, currentTenant = tenant) => {
    const isCO = tenant.id === ControlOfficePrjId || isPublic;
    getEmployeesByTenant({
      keyword,
      page,
      tenantId: currentTenant.id,
      isCO,
    });
  };

  const handleChangeAssignee = async (value, fromOnChange = true) => {
    const tasks = _.map(value, (item) => ({
      ...item,
      userId: item.id,
      tenantId: item.tenantId,
      taskId: id,
    }));

    setValue('taskAssigns', tasks);

    if (value.length > 0 && fromOnChange) {
      const userIds = _.uniq([...reminder.userIds, ..._.map(value, (item) => item.id, user.id)]);
      const users = _.uniqBy([...reminder.users, ...value, user], 'id');

      setValue('reminder.users', users);
      setValue('reminder.userIds', userIds);

      if (!isTeamSelectionFirst) {
        fetchTeamsForAssignees(value);
      }
    }
  };

  const handleTeamChange = async (selectedTeams) => {
    setValue('assignees', []);
    const isCOTeam = (teamId) => {
      const team = _.find(teamList, (team) => team.id === teamId);
      return team?.tenantId === ControlOfficePrjId;
    };

    const coTeamIds = selectedTeams.filter(isCOTeam);
    const siteTeamIds = selectedTeams.filter((teamId) => !isCOTeam(teamId));

    await getUsersInTeamByTenants({
      teamIds: siteTeamIds,
      tenantId: tenant.id,
      teamCoIds: coTeamIds,
    });
  };


  const addSubTask = () => {
    navigation.replace('addSubTask', {
      startDate: watch('startDate'),
      endDate: watch('endDate'),
      isPublic: _.first(watch('isPublic')),
      parentId: id,
    });
  };

  const goToSubTask = (item) => {
    navigation.replace('editSubTask', {
      id: item.id,
    });
  };

  const handleSave = async (values) => {
    const payload = {
      ...values,
      creatorUserId: user.id,
      tenantId: values.tenant.id,
      parentId: values.parentId || null,
    };

    const transformedTask = transformParams(payload, isTeamSelectionFirst ? teamList : teamsByUsers, id);
    const params = removeUnnecessaryProperties(transformedTask);
    const submitRequest = isAddNew || isAddNewSubTask ? addTask : updateTask;
    const res = await submitRequest(params);
    if (res) {
      DeviceEventEmitter.emit('ReloadTM');
    }
  };

  const updateReminderActivation = (statusId) => {
    const currentStatus = statusList.find((status) => status.id === statusId);
    const completedStatuses = ['COMPLETED', 'CANCEL'];
    setAllowReminderAfter(!completedStatuses.includes(currentStatus?.code));
    setAllowReminderBefore(currentStatus?.code !== 'COMPLETED');
  };

  const fetchTeamsForAssignees = async (assignees) => {
    const userIds = assignees
      .filter((assignee) => assignee.tenantId !== ControlOfficePrjId)
      .map((assignee) => assignee.id);

    const userCoIds = assignees
      .filter((assignee) => assignee.tenantId === ControlOfficePrjId)
      .map((assignee) => assignee.id);

    const teams = await getTeamsByUsers({
      userIds: userIds,
      userCoIds: userCoIds,
      tenantId: tenant.id,
    });

    setValue(
      'teamIds',
      _.map(teams, (item) => item.id)
    );
  };

  const onChangeStatus = (selectedStatus) => {
    updateReminderActivation(selectedStatus?.id);
  };

  const mainLayoutProps = {
    title: getTitle(),
    padding: true,
    bottomButtons: [
      {
        title: 'COMMON_SAVE',
        type: 'primary',
        testID: 'button-save',
        permission: !isAddNew && 'TaskManagement.Update',
        onPress: () => {
          formMethods.handleSubmit(handleSave)();
        },
      },
    ],
    customRightBtn: isEdit && isGranted('TaskManagement.Update') && (
      <AddTaskButton title={'SUB_TASK'} testID="buttonAddTask" onPress={addSubTask} />
    ),
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormDisabledProvider disabled={isReadOnly}>
        <AwareScrollView>
          {!isAddNew && taskDetail?.subTasks && (
            <TaskLinkages maxVisibleItems={5} text="SUB_TASK" linkages={taskDetail?.subTasks} onPress={goToSubTask} />
          )}
          {!isAddNew && taskDetail?.parentId && (
            <TaskLinkages text="TASK" linkages={[{ id: taskDetail?.parentId }]} onPress={goToSubTask} />
          )}
          <FormProvider {...formMethods}>
            <FormRadioGroup
              name="isPublic"
              options={[
                { label: 'CONTROL_OFFICE', value: true },
                { label: 'SITE_LEVEL', value: false },
              ]}
              onChange={(val) => resetTeamAssignee(isTeamSelectionFirst, _.first(val))}
            />

            <FormInput testID="task-name" required label={'COMMON_NAME'} name="name" />

            <FormInput showCharacterCount maxLength={MAX_TEXT_LENGTH} testID="task-description" required label={'COMMON_DESCRIPTION'} name="description" multiline />

            <FormLazyDropdown
              listExist={tenantList.data}
              showSearchBar
              getList={(page, keyword) =>
                getTenantList({
                  page,
                  keyword,
                })
              }
              testID="project"
              options={tenantList}
              title="PROJECT"
              label="PROJECT"
              name="tenant"
              disabled={userTenant?.id !== ControlOfficePrjId}
              onChange={onChangeTenantId}
            />

            <FormInput testID="creatorUser" label={'CREATED_BY'} name="creatorUser.displayName" editable={false} value={user.displayName} />

            <Box title="AD_CRWO_TITLE_EXPECTED_DATE">
              <RowWrapper>
                <DateWrapper>
                  <FormDate
                    required
                    label={'START_DATE_TIME'}
                    name="startDate"
                    small
                    mode="datetime"
                    maximumDate={watch('endDate')}
                  />
                </DateWrapper>
                <DateWrapper>
                  <FormDate mode="datetime" required label={'DUE_DATE_TIME'} name="endDate" small minimumDate={watch('startDate')} />
                </DateWrapper>
              </RowWrapper>
            </Box>

            <FormDropdown testID="priority" required label={'COMMON_PRIORITY'} name="priorityId" options={priorityList} />

            <FormDropdown
              required
              label={'COMMON_STATUS'}
              name="statusId"
              options={statusList}
              testID="status"
              onChange={onChangeStatus}
            />

            <FormRadioGroup
              name="isTeamSelectionFirst"
              options={[
                { label: 'TEAM_MANAGEMENT', value: true },
                { label: 'ASSIGNEE', value: false },
              ]}
              horizontal
              onChange={(val) => resetTeamAssignee(_.first(val))}
            />

            {_.first(watch('isTeamSelectionFirst')) ? (
              <Fragment>
                <FormDropdown
                  required
                  label={'TEAM_MANAGEMENT'}
                  name="teamIds"
                  options={teamList}
                  multiple
                  showSearchBar
                  onChange={handleTeamChange}
                  testID="team"
                  defaultTitle={getDefaultTitleFromArr(taskDetail?.teams)}
                />

                <View>
                  <FormDropdown
                    required
                    multiple
                    label={'COMMON_ASSIGNEES'}
                    name="assignees"
                    options={usersInTeams}
                    onChange={handleChangeAssignee}
                    showValue={false}
                    fieldName="displayName"
                    disabled={!_.size(teamIds)}
                    showSearchBar
                    testID="assignee"
                    shouldUniqueItems
                  />
                  <ButtonHint content={'ADD_ALL_TOOLTIP'} style={{ position: 'absolute', right: 10, top: 7 }} />
                </View>
              </Fragment>
            ) : (
              <Fragment>
                <FormLazyDropdown
                  listExist={employeesByTenant.data}
                  showSearchBar
                  getList={(page, keyword) => getAssigneesByTenant(page, keyword)}
                  options={employeesByTenant}
                  label="COMMON_ASSIGNEES"
                  fieldName="displayName"
                  titleKey="displayName"
                  multiple
                  name="assignees"
                  required
                  onChange={handleChangeAssignee}
                  testID="assignee"
                />
                <FormDropdown
                  required
                  label={'TEAM_MANAGEMENT'}
                  name="teamIds"
                  options={teamsByUsers}
                  multiple
                  showSearchBar
                  disabled={!_.size(assignees)}
                  testID="team"
                />
              </Fragment>
            )}

            <FormDropdown required testID="frequency" label={'FREQUENCY'} name="frequency" options={frequencyList} />

            <Reminder
              disabled={!allowReminderBefore && !allowReminderAfter}
              initialValues={reminder}
              allowReminderAfter={allowReminderAfter}
              allowReminderBefore={allowReminderBefore}
              maximumRemindersAfter={maximumRemindersAfter}
              onChange={(reminderData) => setValue('reminder', reminderData)}
            />

            <FormDocumentPicker label={'COMMON_DOCUMENT'} name="files" />
          </FormProvider>
        </AwareScrollView>
      </FormDisabledProvider>

      {!isAddNew && <TaskManagementComment teamList={teamList} task={watch()} />}
    </BaseLayout>
  );
};

export default TaskDetail;
