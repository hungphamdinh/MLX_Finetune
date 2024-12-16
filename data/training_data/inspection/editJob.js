/* eslint-disable react/jsx-curly-brace-presence */
import React, { useEffect, useState } from 'react';
import I18n from '@I18n';
import { FormProvider, useFieldArray } from 'react-hook-form';
import NavigationService from '@NavigationService';
import { Card, TextBox, IconButton, Text } from '@Elements';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';
import _ from 'lodash';
import styled from 'styled-components/native';
import BaseLayout from '../../../../Components/Layout/BaseLayout';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import useTeam from '../../../../Context/Team/Hooks/UseTeam';
import useFile from '../../../../Context/File/Hooks/UseFile';
import useUser from '../../../../Context/User/Hooks/UseUser';
import useWorkflow from '../../../../Context/Workflow/Hooks/UseWorkflow';
import {
  FORM_STATUS_ID,
  ModuleNames,
  Modules,
  INSPECTION_MARCHING_TYPE,
  INSPECTION_STATUS,
} from '../../../../Config/Constants';
import AwareScrollView from '../../../../Components/Layout/AwareScrollView';
import {
  FormCheckBox,
  FormDate,
  FormDisabledProvider,
  FormDocumentPicker,
  FormDropdown,
  FormInput,
} from '../../../../Components/Forms';

import FormSuggestionPicker, { SuggestionTypes } from '../../../../Components/Forms/FormSuggestionPicker';
import {
  WorkflowDatePicker,
  WorkflowDropdown,
  WorkflowInput,
  WorkflowLazyDropdown,
  WorkflowNumberInput,
  WorkflowPropertyInfo,
} from '../../../../Components/InnovatorInspection/WorkflowInput';
import { parseDate, formatDate } from '../../../../Utils/transformData';
import { getValidationForWorkflow } from '../../../../Utils/inspectionUtils';
import { toast } from '../../../../Utils';
import { transformPropertyName } from '../CreateJobScreen/SelectPropertyScreen';

import PropertyInfoModal from '../../../../Components/InnovatorInspection/PropertyInfoModal';
import useProperty from '../../../../Context/Property/Hooks/UseProperty';
import { useCompatibleForm, useYupValidationResolver } from '../../../../Utils/hook';
import { AlertNative } from '../../../../Components';
import GeneralInfo from '../../../../Components/InnovatorInspection/Generallnfo';
import { isGranted } from '../../../../Config/PermissionConfig';
import { getUniqueData } from '../../../../Utils/array';
import useSync from '../../../../Context/Sync/Hooks/UseSync';
import useFeatureFlag from '../../../../Context/useFeatureFlag';
import useAsset from '../../../../Context/Asset/Hooks/UseAsset';
import { Colors } from '../../../../Themes';

const CardWrapper = styled(Card)`
  margin-horizontal: 0px;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const AssetCard = styled(Card)`
  margin-horizontal: 0px;
  border-width: 1px;
  border-color: ${Colors.disabled};
`;

const AssetHeader = styled.View`
  position: absolute;
  right: 0px;
`;

const AssetTitle = styled(Text)`
  margin-bottom: 10px;
`;

const CreateOrEditJob = ({ navigation }) => {
  const routeName = _.get(navigation, 'state.routeName');
  const callBack = navigation.getParam('callBack');
  const isAddNew = routeName === 'addJob';
  const [visiblePropertyInfo, setVisiblePropertyInfo] = useState(false);
  const selectedProperty = navigation.getParam('selectedProperty');

  const {
    workflow: { statusList, priorities, trackers },
  } = useWorkflow();

  const {
    property: { propertyDetail, propertiesToSelect },
    getDetailProperty,
    getPropertiesToSelect,
  } = useProperty();

  const {
    user: { user },
  } = useUser();

  const {
    getUserInTeam,
    team: { inspectionTeams, assignedInspectionTeams, usersInTeam },
  } = useTeam();

  const { ensureSyncCompleted } = useSync();

  const {
    inspection: { inspectionDetailInfo, headers, footers, inspectionSetting },
    getInspectionDetailInfo,
    createOnlineInspection,
    updateOnlineInspections,
    uploadInspectionDocument,
    releaseInspection,
  } = useInspection();

  const {
    file: { attachmentFiles, signatureFiles },
    getByReferenceIdAndModuleNames,
  } = useFile();

  const {
    asset: { assets },
    searchAssets,
  } = useAsset();

  const isCompleted =
    inspectionDetailInfo?.workflow.status.isIssueClosed &&
    inspectionDetailInfo?.workflow.status.code === INSPECTION_STATUS.COMPLETED;

  let isRequiredLocationEditMode = false;
  if (inspectionDetailInfo) {
    isRequiredLocationEditMode = inspectionDetailInfo.isRequiredLocationEditMode;
  }

  const { isEnableLiveThere } = useFeatureFlag();
  const hadSignature = _.size(signatureFiles) > 0;

  const inspectionId = navigation.getParam('id');
  const requiredQuestion = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  let isPropertyLiveThere = false;
  if (propertyDetail?.users) {
    isPropertyLiveThere =
      isEnableLiveThere && propertyDetail?.users.length > 0 && propertyDetail.source === 'LiveThere';
  }

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required(I18n.t(requiredQuestion)),
    form: Yup.object().required(I18n.t(requiredQuestion)),
    teamAssigneeId: Yup.number()
      .nullable()
      .test('Team Assignee err', requiredQuestion, function (value) {
        const isAllowTeamAssignment = this.parent.isAllowTeamAssignment;
        return (
          (value && (!isAllowTeamAssignment || !isPropertyLiveThere)) ||
          (!value && (isPropertyLiveThere || isAllowTeamAssignment))
        );
      }),
    teamId: Yup.number()
      .nullable()
      .when(['isAllowTeamAssignment'], {
        is: true,
        then: Yup.number().nullable().required(requiredQuestion),
      }),
    ...getValidationForWorkflow(inspectionDetailInfo?.workflow?.propertyPermissions),
    assets: Yup.array().of(
      Yup.object().shape({
        location: Yup.object()
          .nullable()
          .test('location-required', I18n.t('FORM_THIS_FIELD_IS_REQUIRED'), (value) => {
            if (isRequiredLocationEditMode) {
              return value;
            }
            return true;
          }),
      })
    ),
  });

  const defaultStatus = statusList.find((status) => status.isDefault);
  const isPicked = !isAddNew && inspectionDetailInfo?.pickedByUser;
  const creatorUserId = inspectionDetailInfo ? inspectionDetailInfo.workflow.creatorUser.id : null;
  const lockAssigned = [creatorUserId];

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      subject: '',
      tenancyName: '',
      property: undefined,
      form: undefined,
      statusId: undefined,
      teamId: undefined,
      closedDate: undefined,
      dueDate: undefined,
      rescheduleDate: undefined,
      rescheduleRemark: '',
      files: [],
      listAssigneeIds: [],
      headerId: undefined,
      footerId: undefined,
      teamAssigneeId: undefined,
      isRequiredLocation: false,
      isRequiredSignature: false,
      estimatedHours: {
        text: '',
        rawValue: 0,
      },
      doneRatio: {
        text: '',
        rawValue: 0,
      },
      isAllowTeamAssignment: false,
      assets: [],
    },
  });

  const teamAssigneeIdValue = formMethods.watch('teamAssigneeId');
  const creator = inspectionDetailInfo?.workflow?.creatorUser;

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({
    control: formMethods.control,
    name: 'assets',
  });

  React.useEffect(() => {
    formMethods.setValue('files', attachmentFiles);
  }, [_.size(attachmentFiles)]);

  const convertToAssignees = (list) => {
    if (_.size(list) > 0) {
      return list.map((item) => {
        item.userId = item.id;
        return item;
      });
    }
    return [];
  };

  let assignees = [{ ...creator, userId: creator?.id }];
  if (isPropertyLiveThere) {
    const listAssigned = convertToAssignees(inspectionDetailInfo?.listAssigned);
    assignees = getUniqueData([...listAssigned, ...propertyDetail.users, ...assignees], 'userId');
  } else if (teamAssigneeIdValue) {
    assignees = usersInTeam;
  }

  useEffect(() => {
    if (!isAddNew) {
      initDetailInfo();
      searchAssets();
    }
  }, [inspectionId]);

  useEffect(() => {
    if (selectedProperty) {
      formMethods.setValue('property', selectedProperty);
    }
  }, [selectedProperty]);

  useEffect(() => {
    formMethods.reset(getInitialValuesForUpdate());
  }, [inspectionDetailInfo, defaultStatus, isPropertyLiveThere]);

  const getProperties = (page = 1) => {
    getPropertiesToSelect({
      page,
    });
  };

  const initDetailInfo = async () => {
    const res = await getInspectionDetailInfo({ id: parseInt(inspectionId, 10) });
    if (res.inspectionPropertyI) {
      await getDetailProperty(res.inspectionPropertyId);
    }
    getProperties();
    if (res) {
      getByReferenceIdAndModuleNames(res.guid, ModuleNames.InspectionAttachFile, 'attachmentFiles');
      getByReferenceIdAndModuleNames(res.guid, ModuleNames.InspectionSignatures, 'signatureFiles');
      if (res.teamAssignee) {
        getUserInTeam(res.teamAssignee?.id);
      }
    }
  };

  const handleAddAsset = () => {
    appendAsset({ asset: null, location: null, id: null });
  };

  const btShowPropertyInfoPress = async () => {
    const values = formMethods.getValues();
    await getDetailProperty(values.property.id);
    setVisiblePropertyInfo(true);
  };

  const onClosePropertyInfo = () => {
    setVisiblePropertyInfo(false);
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {
        statusId: defaultStatus?.id,
      };
    }

    if (inspectionDetailInfo) {
      const { workflow, tenancyName, inspectionProperty, isRequiredLocation, isRequiredSignature, headerId, footerId } =
        inspectionDetailInfo;
      return {
        ...inspectionDetailInfo,
        isRequiredSignature,
        isRequiredLocation,
        ...workflow,
        headerId,
        footerId,
        tenancyName,
        closedDate: parseDate(workflow.closedDate),
        dueDate: parseDate(workflow.dueDate),
        rescheduleDate: parseDate(workflow.rescheduleDate),
        form: workflow.form,
        property: {
          ...inspectionProperty,
          name: transformPropertyName(inspectionDetailInfo.inspectionProperty, isEnableLiveThere),
        },
        statusId: workflow.status.id,
        priorityId: workflow.priority?.id,
        teamId: inspectionDetailInfo.teamId,
        teamAssigneeId: inspectionDetailInfo.teamAssignee?.id,
        listAssigneeIds:
          inspectionDetailInfo.teamAssignee || isPropertyLiveThere
            ? [...inspectionDetailInfo.listAssigneeIds, creatorUserId]
            : [creatorUserId],
        listAssigned: _.map(inspectionDetailInfo.listAssigned, (item) => ({ ...item, userId: item.id })),
        trackerId: workflow.tracker?.id,
        estimatedHours: {
          text: workflow.estimatedHours,
          rawValue: workflow.estimatedHours,
        },
        doneRatio: {
          text: workflow.estimatedHours,
          rawValue: workflow.estimatedHours,
        },
        files: attachmentFiles || [],
        isAllowTeamAssignment: inspectionDetailInfo.team,
        assets: _.size(inspectionDetailInfo.assets)
          ? inspectionDetailInfo.assets
          : [{ asset: null, location: null, id: null }],
      };
    }
    return {};
  };

  const disabledForm = !isAddNew;

  const onSelectTeam = (teamId) => {
    formMethods.setValue('listAssigned', undefined);
    formMethods.setValue('teamId', undefined);
    formMethods.setValue('listAssigneeIds', [user.id]);
    getUserInTeam(teamId);
  };

  const onError = async (values) => {
    console.log('onError', values);
  };

  const askToRelease = (onRelease, onUpdate) => {
    AlertNative(
      I18n.t('INSPECTION_ASK_RELEASE'),
      I18n.t('INSPECTION_ASK_RELEASE_MESSAGE'),
      onRelease,
      I18n.t('AD_COMMON_YES'),
      I18n.t('AD_COMMON_NO'),
      onUpdate
    );
  };

  async function uploadFile(result, files) {
    const documentId = isAddNew ? result.guid : inspectionDetailInfo.guid;
    const uploadFiles = files.filter((item) => item.path);
    if (uploadFiles.length > 0) {
      await uploadInspectionDocument(documentId, uploadFiles);
    }
    toast.showSuccess(I18n.t(isAddNew ? 'INSPECTION_CREATE_SUCCESSFUL' : 'INSPECTION_UPDATE_SUCCESSFUL'));
  }

  const updateAndRelease = async (params, files) => {
    const isSyncCompleted = await ensureSyncCompleted();
    if (!isSyncCompleted) {
      return;
    }
    const response = await updateOnlineInspections(params, callBack);
    uploadFile(response, files);
    if (response) {
      const result = releaseInspection(inspectionDetailInfo.id, inspectionDetailInfo.workflow.guid);
      if (result) {
        NavigationService.pop(2);
      }
    }
  };

  const updateWithOutRelease = async (params, files) => {
    const result = await updateOnlineInspections(params, callBack);
    uploadFile(files);
    if (result) {
      NavigationService.goBack();
    }
  };

  function arraysEqual(a1, a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1) === JSON.stringify(a2);
  }

  const onSubmit = async (values) => {
    const {
      property,
      teamId,
      form,
      doneRatio,
      estimatedHours,
      dueDate,
      listAssigneeIds,
      listAssigned,
      teamAssigneeId,
      isAllowTeamAssignment,
      files,
      headerId,
      footerId,
      isRequiredSignature,
      isRequiredLocation,
      tenancyName,
      marchingIn,
      marchingOut,
      marchingDate,
      premises,
      landlord,
      occupant,
      closedDate,
      status,
      location,
      asset,
      ...restValues
    } = values;

    let marchingType = 0;

    const listAssignedIdsWithoutCreator = listAssigneeIds.filter((item) => item !== creatorUserId);

    const checkTeamAssignment = isAllowTeamAssignment && teamId !== inspectionDetailInfo.teamId;
    const checkAssignee = !arraysEqual(listAssignedIdsWithoutCreator, inspectionDetailInfo.listAssigneeIds);
    const checkUpdateTeamAssignmentOption = !isAllowTeamAssignment && inspectionDetailInfo.teamId;

    if (marchingDate) {
      if (marchingIn) {
        marchingType = INSPECTION_MARCHING_TYPE.IN;
      } else {
        marchingType = INSPECTION_MARCHING_TYPE.OUT;
      }
    }

    const assetsParams = values.assets.map((item) => ({
      assetId: item.asset?.id,
      locationId: item.location?.id,
      location: item.location,
    }));

    let params = {
      premises,
      occupant,
      landlord,
      marchingType,
      marchingDate: formatDate(marchingDate, null),
      id: isAddNew ? undefined : inspectionDetailInfo.id,
      inspectionPropertyId: property.id,
      statusId: status?.id,
      isRequiredLocation,
      isRequiredSignature,
      tenancyName,
      headerId,
      footerId,
      workflow: {
        ...restValues,
        id: isAddNew ? undefined : inspectionDetailInfo.workflow.id,
        form,
        formId: form.id,
        doneRatio: doneRatio.rawValue,
        estimatedHours: estimatedHours.rawValue,
        startDate: formatDate(startDate, null),
        closedDate: formatDate(closedDate, null),
        dueDate: formatDate(dueDate, null),
        rescheduleDate: formatDate(rescheduleDate, null),
      },
      assets: assetsParams,
    };
    delete params.workflow.form;
    if (isAllowTeamAssignment) {
      params = {
        ...params,
        teamId,
      };
    } else {
      params = {
        ...params,
        listAssigned,
        listAssigneeIds: listAssignedIdsWithoutCreator,
        teamAssigneeId,
      };
    }
    delete values.marchingIn;
    delete values.marchingOut;

    let submitRequest = null;
    if (isAddNew) {
      submitRequest = createOnlineInspection;
    } else if ((checkAssignee || checkTeamAssignment || checkUpdateTeamAssignmentOption) && isPicked) {
      submitRequest = () =>
        askToRelease(
          () => updateAndRelease(params, files),
          () => updateWithOutRelease(params)
        );
    } else {
      submitRequest = () => updateOnlineInspections(params, callBack);
    }

    const result = await submitRequest(params);
    if (result) {
      await uploadFile(result, files);
      NavigationService.goBack();
    }
  };

  const [form, isAllowTeamAssignment, rescheduleDate, startDate, property] = formMethods.watch([
    'form',
    'isAllowTeamAssignment',
    'rescheduleDate',
    'startDate',
    'property',
  ]);
  const defaultTeamAssigned = isAddNew ? '' : inspectionDetailInfo?.teamAssignee?.name;
  const defaultTeamAssignment = isAddNew ? '' : inspectionDetailInfo?.team?.name;

  const mainLayoutProps = {
    padding: true,
    title: isAddNew ? I18n.t('INSPECTION_ADD_JOB') : I18n.t('INSPECTION_EDIT_JOB'),
    bottomButtons: [
      {
        title: I18n.t('AD_COMMON_SAVE'),
        type: 'primary',
        onPress: formMethods.handleSubmit(onSubmit, onError),
        disabled: hadSignature,
      },
    ],
  };

  if (!isAddNew && !inspectionDetailInfo) {
    return <BaseLayout {...mainLayoutProps} />;
  }

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormDisabledProvider disabled={hadSignature}>
        <FormProvider {...formMethods}>
          <AwareScrollView>
            <CardWrapper>
              <FormInput
                editable={!hadSignature}
                required
                label="INSPECTION_JOB_NAME"
                maxLength={200}
                name="subject"
                mode="small"
              />
              <WorkflowLazyDropdown
                listExist={propertiesToSelect.data}
                mode="small"
                showSearchBar
                getList={(page, key) => getProperties(page, key)}
                options={propertiesToSelect}
                title="INSPECTION_PROPERTY"
                label="INSPECTION_PROPERTY"
                name="property"
                workflowField="InspectionPropertyId"
              />
              {property && (
                <WorkflowPropertyInfo workflowField="InspectionPropertyId" onPress={btShowPropertyInfoPress} />
              )}
              <FormDropdown
                options={headers}
                label="INSPECTION_HEADER"
                placeholder=""
                disabled={hadSignature}
                mode="small"
                name="headerId"
                fieldName="headerTitle"
              />
              {isGranted('Inspection.ExportPdfHandOverHK') && (
                <FormDropdown
                  options={footers}
                  label="INSPECTION_FOOTER"
                  placeholder=""
                  disabled={hadSignature}
                  mode="small"
                  name="footerId"
                  fieldName="footerTitle"
                />
              )}

              <FormSuggestionPicker
                required
                type={SuggestionTypes.FORM}
                label="FORM_NAME"
                placeholder="FORM_NAME"
                name="form"
                mode="small"
                disabled={disabledForm || hadSignature}
                addOnParams={{ isActive: true, moduleId: Modules.INSPECTION, status: FORM_STATUS_ID.PUBLIC }}
              />
              {form?.categoryName ? <TextBox mode={'small'} label={'FORM_CATEGORY'} text={form?.categoryName} /> : null}

              <AssetTitle text="ASSET_LOCATION" />
              {assetFields.map((field, index) => (
                <AssetCard key={field.id}>
                  {index > 0 && (
                    <AssetHeader>
                      <IconButton color="red" size={20} onPress={() => removeAsset(index)} name="close-circle" />
                    </AssetHeader>
                  )}

                  <FormDropdown
                    mode="small"
                    showSearchBar
                    options={assets}
                    title={`${I18n.t('ASSET')} ${index + 1}`}
                    label={`${I18n.t('ASSET')} ${index + 1}`}
                    name={`assets.${index}.asset`}
                    showValue={false}
                    fieldName="assetName"
                    onChange={(data) => {
                      formMethods.setValue(`assets.${index}.location`, data.location);
                    }}
                    disabled={isCompleted}
                  />

                  <FormSuggestionPicker
                    type={SuggestionTypes.LOCATION}
                    label={`${I18n.t('COMMON_LOCATION')} ${index + 1}`}
                    placeholder={`${I18n.t('COMMON_LOCATION')} ${index + 1}`}
                    name={`assets.${index}.location`}
                    mode="small"
                    required={isRequiredLocationEditMode}
                    defaultValue={formMethods.getValues(`assets.${index}.location`)}
                  />
                </AssetCard>
              ))}
              <AddButton onPress={handleAddAsset}>
                <Text preset="bold" text="ADD_MORE_ASSET" />
                <Icon name="add-circle" color={Colors.azure} size={20} />
              </AddButton>
            </CardWrapper>
            {inspectionSetting?.isShowGeneralInformation && (
              <CardWrapper>
                <GeneralInfo hadSignature={hadSignature} formMethods={formMethods} navigation={navigation} />
              </CardWrapper>
            )}

            <CardWrapper>
              {!isPropertyLiveThere && (
                <FormCheckBox
                  disabled={hadSignature}
                  label="INSPECTION_ALLOW_TEAM_ASSIGNMENT"
                  name="isAllowTeamAssignment"
                />
              )}

              {isAllowTeamAssignment ? (
                <FormDropdown
                  showCheckAll={false}
                  showSearchBar
                  options={assignedInspectionTeams}
                  defaultTitle={defaultTeamAssignment}
                  disabled={hadSignature}
                  label="INSPECTION_TEAMS"
                  placeholder=""
                  required
                  mode="small"
                  onChange={() => formMethods.setValue('listAssigneeIds', [])}
                  name="teamId"
                />
              ) : (
                <>
                  {!isPropertyLiveThere && (
                    <FormDropdown
                      showCheckAll={false}
                      showSearchBar
                      defaultTitle={defaultTeamAssigned}
                      disabled={hadSignature}
                      options={inspectionTeams}
                      label="INSPECTION_ASSIGNEE_TEAM"
                      placeholder=""
                      mode="small"
                      required
                      name="teamAssigneeId"
                      onChange={onSelectTeam}
                    />
                  )}

                  <FormDropdown
                    showCheckAll={false}
                    showSearchBar
                    disabled={hadSignature}
                    options={assignees}
                    lockValues={lockAssigned}
                    label="INSPECTION_ASSIGNEES"
                    name="listAssigneeIds"
                    mode="small"
                    fieldName="displayName"
                    valKey="userId"
                    multiple
                  />
                </>
              )}
            </CardWrapper>
            <CardWrapper>
              <WorkflowDropdown
                required
                options={statusList}
                label="AD_CRWO_TITLE_STATUS"
                workflowField="StatusId"
                placeholder=""
                mode="small"
                name="statusId"
              />

              <WorkflowDropdown
                required
                options={priorities}
                label="COMMON_PRIORITY"
                workflowField="PriorityId"
                placeholder=""
                mode="small"
                disabled={hadSignature}
                name="priorityId"
              />
              <WorkflowDropdown
                required
                options={trackers}
                label="WF_TRACKER"
                workflowField="TrackerId"
                placeholder=""
                mode="small"
                disabled={hadSignature}
                name="trackerId"
              />
              {isPicked && (
                <TextBox
                  mode={'small'}
                  label={'INSPECTION_PICKED_BY'}
                  text={inspectionDetailInfo.pickedByUser.displayName}
                />
              )}

              <WorkflowDatePicker
                disabled={hadSignature}
                label="COMMON_CLOSED_DATE"
                name="closedDate"
                mode="datetime"
                workflowField="ClosedDate"
                small
                minimumDate={new Date(startDate)}
                overflow={false}
              />
              <WorkflowDatePicker
                label="INSPECTION_DUE_DATE"
                workflowField="DueDate"
                mode="datetime"
                name="dueDate"
                minimumDate={new Date(startDate)}
                small
                overflow={false}
              />
              <WorkflowNumberInput
                multiline
                workflowField="EstimatedHours"
                label="WF_ESTIMATED_HOURS"
                name="estimatedHours"
                mode="small"
              />
              <WorkflowNumberInput
                multiline
                workflowField="DoneRatio"
                label="WF_DONE_RATIO"
                name="doneRatio"
                mode="small"
              />
              <FormInput
                editable={!hadSignature}
                multiline
                label="COMMON_DESCRIPTION"
                maxLength={1000}
                name="description"
                mode="small"
              />
              <FormDate
                disabled={hadSignature}
                label="INSPECTION_RESCHEDULE_DATE"
                name="rescheduleDate"
                small
                mode="datetime"
                overflow={false}
              />
              <WorkflowInput
                editable={!!rescheduleDate || !hadSignature}
                multiline
                workflowField="RescheduleRemark"
                label="INSPECTION_REMARK"
                maxLength={200}
                name="rescheduleRemark"
                mode="small"
              />
              <FormCheckBox disabled={hadSignature} label="FORM_ALLOW_LOCATIONS" name="isRequiredLocation" />
              <FormCheckBox disabled={hadSignature} label="FORM_IS_REQUIRED_SIGNATURE" name="isRequiredSignature" />
            </CardWrapper>
            <FormDocumentPicker disabled={hadSignature} name="files" />
          </AwareScrollView>
        </FormProvider>
        <PropertyInfoModal
          visible={visiblePropertyInfo}
          propertyDetail={propertyDetail}
          onClosePress={onClosePropertyInfo}
        />
      </FormDisabledProvider>
    </BaseLayout>
  );
};

export default CreateOrEditJob;
