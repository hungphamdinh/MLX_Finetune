import React, { Fragment, useEffect } from 'react';
import _ from 'lodash';
import { DeviceEventEmitter, View } from 'react-native';
import { FormProvider } from 'react-hook-form';
import NavigationService from '@NavigationService';
import * as Yup from 'yup';
import {
  FormInput,
  FormDate,
  FormLazyDropdown,
  FormRadioGroup,
  FormSwitch,
  FormDocumentPicker,
  FormDisabledProvider,
} from '@Components/Forms';
import FormMoneyInput from '@Components/Forms/FormMoneyInput';
import { Box, IconButton, TextBox, Text, Button } from '@Elements';
import { Colors } from '@Themes';
import LocaleConfig from '@Config/LocaleConfig';
import I18n from '@I18n';
import { validateEmail, getCompanyRepresentativeName } from '@Utils/common';
import { AssetLocationType } from '@Config/Constants';
import useFile from '@Context/File/Hooks/UseFile';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import { modal } from '@Utils';
import useUser from '@Context/User/Hooks/UseUser';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import { daysToMinutes, minutesToDays } from '@Utils/convertDate';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';
import FormSuggestionPicker, { SuggestionTypes } from '@Components/Forms/FormSuggestionPicker';
import useFeedback from '@Context/Feedback/Hooks/useFeedback';
import { parseDate } from '../../../../Utils/transformData';
import ItemUserEmail from '../../../Inventory/FormInventoryItem/ItemUserEmail';

const DetailTab = ({ assetDetail, isAddNew, readOnly }) => {
  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    assetName: Yup.string().required(requiredMessage),
    assetType: Yup.object().nullable().required(requiredMessage),
    description: Yup.string().required(requiredMessage),
  });
  const isIMT = !isAddNew && _.size(assetDetail?.referenceId) > 0;

  const defaultCost = {
    text: '0',
    rawValue: 0,
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      assetName: '',
      assetCode: '',
      assetType: null,
      purchasedDate: null,
      price: defaultCost,
      serialNumber: '',
      warrantDate: null,
      description: '',
      companyCode: '',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      code: '',
      unitLocation: '',
      inventoryBrand: null,
      locationType: [1],
      reminder: {
        emails: [],
        isActive: false,
        users: [],
        reminderDay: 0,
      },
      files: [],
      assetCreationTime: undefined,
      model: '',
    },
  });

  const {
    asset: { assetTypes },
    getAssetTypes,
    addAsset,
    editAsset,
  } = useAsset();

  const {
    feedback: { qrFeedbackSetting },
    getQrFeedbackSetting,
  } = useFeedback();

  const {
    user: { employees },
    getEmployees,
  } = useUser();

  const {
    getFileReference,
    resetFiles,
    file: { fileUrls },
  } = useFile();

  useEffect(() => {
    getQrFeedbackSetting();
  }, []);

  const locationTypes = [
    {
      label: I18n.t('AD_CRWO_TITLE_UNIT_LOCATION'),
      value: 1,
    },
    {
      label: I18n.t('COMMON_LOCATION'),
      value: 0,
    },
  ];

  const { setValue, watch } = formMethods;
  const submitRequest = isAddNew ? addAsset : editAsset;

  const onCheckEmail = () => {
    const userEmail = watch('userEmail');
    if (!validateEmail(userEmail)) {
      modal.showError(I18n.t('COMMON_EMAIL_VALIDATION'));
    } else {
      addEmailAndResetInput(userEmail);
    }
  };

  const addEmailAndResetInput = (userEmail) => {
    setValue('reminder.emails', [...watch('reminder.emails'), userEmail]);
    setValue('userEmail', '');
  };

  const removeEmail = (index) => {
    setValue(
      'reminder.emails',
      watch('reminder.emails').filter((_item, idx) => index !== idx)
    );
  };

  const getDefaultEmployees = () => {
    if (assetDetail?.reminder) {
      const { reminder } = assetDetail;
      return _.size(reminder?.users) && reminder?.users.map((item) => item.displayName).join(', ');
    }
    return '';
  };

  useEffect(() => {
    getAssetTypes({
      page: 1,
      keyword: '',
    });
  }, []);

  useEffect(() => {
    if (fileUrls.length > 0) {
      setValue('files', fileUrls);
    }
    return () => {
      resetFiles();
    };
  }, [fileUrls.length]);

  useEffect(() => {
    if (assetDetail) {
      formMethods.reset(getInitialValueForUpdate());
    }
  }, [assetDetail]);

  const getInitialValueForUpdate = () => {
    if (isAddNew) {
      return {};
    }
    const { price, purchasedDate, warrantDate, documentId, reminder } = assetDetail;
    getFileReference(documentId);
    const companyDetail = assetDetail.company;

    const companySelect = {
      id: assetDetail.companyId,
      companyRepresentative: getCompanyRepresentativeName(assetDetail.company),
    };
    const reminderDay = minutesToDays(reminder?.reminderInMinutes);

    return {
      ...assetDetail,
      purchasedDate: parseDate(purchasedDate),
      warrantDate: parseDate(warrantDate),
      price: {
        text: `${LocaleConfig.formatMoney(price)}`,
        rawValue: price,
      },
      companyCode: companyDetail?.companyCode,
      companyName: companyDetail?.companyName,
      companyAddress: companyDetail?.primaryAddress,
      companyPhone: companyDetail?.primaryPhone,
      locationType: [assetDetail.locationType],
      company: companySelect,
      reminder: {
        ...reminder,
        reminderDay,
      },
    };
  };

  const onSubmit = async (values) => {
    const { company, unit, location, price, reminder, files, inventoryBrand } = values;
    const params = {
      ...values,
      locationId: location?.id,
      unitId: unit?.id,
      locationType: locationType[0],
      price: price.rawValue,
      companyId: company?.id,
      assetTypeId: assetType?.id,
      inventoryBrandId: inventoryBrand?.id,
      reminder: {
        ...reminder,
        userIds: _.map(reminder.user, (item) => item.id),
        reminderInMinute: daysToMinutes(reminder.reminderDay),
      },
    };

    const response = await submitRequest({
      params,
      files,
    });
    if (response) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('ReloadAsset');
    }
  };

  const [locationType, assetType] = watch(['locationType', 'assetType']);

  return (
    <AwareScrollView style={{ marginHorizontal: 20 }} tabLabel={I18n.t('AD_ASSETS_TAB_DETAIL')}>
      <FormProvider {...formMethods}>
        <FormDisabledProvider disabled={readOnly}>
          {!qrFeedbackSetting?.isEmbedExternalWebsite && (
            <View>
              <FormInput required label="AD_ASSETS_TITLE_ASSETSNAME" name="assetName" editable={!isIMT} />
              <Box title="AD_ASSETS_TITLE_TYPE">
                <FormLazyDropdown
                  listExist={assetTypes.data}
                  showSearchBar
                  getList={(page, keyword) =>
                    getAssetTypes({
                      page,
                      keyword,
                    })
                  }
                  options={assetTypes}
                  mode="small"
                  required
                  title="AD_ASSETS_TYPENAME"
                  label="AD_ASSETS_TYPENAME"
                  titleKey="assetTypeName"
                  name="assetType"
                  disabled={isIMT}
                />
                <FormDate
                  small
                  label="AD_ASSETS_CREATETIME"
                  name="assetCreationTime"
                  mode="date"
                  disabled
                  value={assetType?.creationTime}
                />
              </Box>

              <Box title="AD_ASSETS_TITLE_COMPANY">
                <FormSuggestionPicker
                  type={SuggestionTypes.COMPANY_REPRESENTATIVE}
                  label="STOCK_COMPANY"
                  name="company"
                  mode="small"
                  onChange={(companySelected) => {
                    setValue('companyPhone', companySelected.primaryPhone);
                    setValue('companyCode', companySelected.companyCode);
                    setValue('companyAddress', companySelected.primaryAddress);
                  }}
                  disabled={isIMT}
                />

                <FormInput mode="small" label="AD_ASSETS_COMPANY_CODE" name="companyCode" editable={false} />
                <FormInput mode="small" label="AD_ASSETS_COMPANY_ADDRESS" name="companyAddress" editable={false} />
                <FormInput mode="small" label="AD_ASSETS_COMPANY_PHONE" name="companyPhone" editable={false} />
              </Box>
              <Box title="AD_ASSETS_TITLE_INFO">
                {!isAddNew && (
                  <Fragment>
                    <TextBox
                      disabled
                      mode="small"
                      label="STATUS"
                      text={assetDetail?.isActive ? 'COMMON_ACTIVE' : 'COMMON_INACTIVE'}
                    />
                    <FormInput mode="small" label="AD_ASSETS_CODE" name="code" editable={false} />
                  </Fragment>
                )}

                <FormSuggestionPicker
                  type={SuggestionTypes.BRAND}
                  label="AD_ASSETS_BRAND"
                  name="inventoryBrand"
                  mode="small"
                  disabled={isIMT}
                />

                <FormInput mode="small" label="MODEL" name="model" editable={!isIMT} />
                <FormInput mode="small" label="AD_ASSETS_SERI" name="serialNumber" editable={!isIMT} />
                <FormDate small label="AD_ASSETS_PURCHASE_DATE" name="purchasedDate" mode="date" editable={!isIMT} />
                <FormDate small label="AD_ASSETS_WARRANT_DATE" name="warrantDate" mode="date" />
                <FormMoneyInput mode="small" label="AD_ASSETS_PRICE" name="price" />
                <FormRadioGroup mode="small" options={locationTypes} name="locationType" horizontal />
                <View>
                  {_.first(locationType) === AssetLocationType.Unit && ( // should take final result of locationType to init default
                    <FormSuggestionPicker
                      addOnParams={{ page: 1, pageSize: 50 }}
                      type={SuggestionTypes.LIST_UNIT}
                      name="unit"
                      mode="small"
                    />
                  )}
                  {_.first(locationType) === AssetLocationType.Location && (
                    <FormSuggestionPicker mode="small" type={SuggestionTypes.LOCATION} name="location" />
                  )}
                </View>
              </Box>
              <FormSwitch label="REMINDER" placeholder="" name="reminder.isActive" />
              <Box>
                {watch('reminder.isActive') && (
                  <Fragment>
                    <FormLazyDropdown
                      listExist={employees.data}
                      showSearchBar
                      getList={(page, keyword) =>
                        getEmployees({
                          page,
                          keyword,
                        })
                      }
                      multiple
                      titleKey="displayName"
                      fieldName="displayName"
                      options={employees}
                      title="ADD_USER_TO_NOTIFICATION"
                      label="ADD_USER_TO_NOTIFICATION"
                      name="reminder.users"
                      mode="small"
                      defaultTitle={getDefaultEmployees()}
                    />
                    <FormInput
                      rightIcon={<Text text="DAYS" />}
                      keyboardType="number-pad"
                      mode="small"
                      label="REMINDER_BEFORE"
                      name="reminder.reminderDay"
                    />
                    <FormInput
                      label="ADD_EMAIL_TO_NOTIFICATION"
                      name="userEmail"
                      placeholder="ADD_EMAIL_TO_NOTIFICATION"
                      mode="small"
                      rightIcon={<IconButton onPress={onCheckEmail} name="add-outline" color={Colors.text} />}
                    />
                    {_.size(watch('reminder.emails')) > 0 && (
                      <Fragment>
                        {watch('reminder.emails').map((item, index) => (
                          <ItemUserEmail onPressRemove={() => removeEmail(index)} key={index.toString()} item={item} />
                        ))}
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </Box>
              <FormInput editable={!isIMT} required label="AD_ASSETS_TITLE_DES" name="description" multiline />
              <FormDocumentPicker label="COMMON_DOCUMENT" name="files" />
              {!readOnly && (
                <Button testID="save-button" primary rounded onPress={formMethods.handleSubmit(onSubmit)} title={I18n.t('AD_COMMON_SAVE')} />
              )}
            </View>
          )}
          {qrFeedbackSetting?.isEmbedExternalWebsite && (
            <View>
              <FormInput label="AD_ASSETS_TITLE_ASSETSNAME" name="assetName" />
              <Box title="AD_ASSETS_INFORMATION">
                <FormInput mode="small" label="AD_ASSETS_TITLE_ASSETSCODE" name="assetCode" />
                <FormDate
                  small
                  label="AD_ASSETS_CREATETIME"
                  name="assetCreationTime"
                  mode="date"
                  disabled
                  value={assetDetail?.creationTime}
                />
                <FormRadioGroup mode="small" options={locationTypes} name="locationType" horizontal />
                {_.first(locationType) === AssetLocationType.Unit && (
                  <FormSuggestionPicker
                    addOnParams={{ page: 1, pageSize: 50 }}
                    type={SuggestionTypes.LIST_UNIT}
                    name="unit"
                    mode="small"
                  />
                )}
                {_.first(locationType) === AssetLocationType.Location && (
                  <FormSuggestionPicker mode="small" type={SuggestionTypes.LOCATION} name="location" />
                )}
              </Box>
              <TextBox mode="small" label="STATUS" text={assetDetail?.isActive ? 'COMMON_ACTIVE' : 'COMMON_INACTIVE'} />
            </View>
          )}
        </FormDisabledProvider>
      </FormProvider>
    </AwareScrollView>
  );
};

export default DetailTab;
