import React, { useEffect, useRef, useState, Fragment } from 'react';
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import { View } from 'react-native';
import i18n from '@i18n';
import Connect from '@stores';
import _ from 'lodash';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { Form, FormDate, FormDropdown, FormInput, FormDocumentPicker, FormRadioGroup } from '../../../../components/Forms';
import AwareScrollView from '../../../../components/Layout/AwareScrollView';
import BaseLayout from '../../../../components/Layout/BaseLayout';
import { Card, Text } from '../../../../components/Commons';
import Button from '../../../../components/button';
import { Colors } from '../../../../themes';
import Row from '../../../../components/Layout/Row';
import ButtonExpand from '../../../../components/buttonExpand';
import { useRoute } from '@react-navigation/native';

const CardWrapper = styled(Card)``;

const ButtonAdd = styled(Button)`
  margin-right: 2px;
  margin-left: -2px;
`;

const ButtonClose = styled(Button)``;

const VisitorWrapper = styled(Row)`
  margin-bottom: 10px;
  justify-content: space-between;
`;

const BtnAddWrapper = styled(Row)`
  margin-bottom: 10px;
`;

const phoneInputStyles = {
  flex: 1,
};

const IDInputStyles = {
  flex: 1,
  marginLeft: 10,
};

const visitorTypes = [
  {
    label: i18n.t('VISITOR_TYPE_VISITOR'),
    value: 0,
  },
  {
    label: i18n.t('VISITOR_TYPE_CONTRACTOR'),
    value: 1,
  },
];

const TabDetailInfo = ({
  actions,
  visitor: { detailVisitor, listType },
  file: { files },
  units: { unitActive },
  userProfile: { tenant },
  app: {
    settingApp: { dateTimeFormat },
  },
}) => {
  const formikRef = useRef();

  const route = useRoute();
  const id = route.params?.id;
  const isAddNew = route.name === 'AddVisitor';
  const [expanded, setExpand] = useState(false);

  useEffect(() => {
    if (id) {
      actions.visitor.detailVisitor(id);
    }
  }, [id]);

  const requiredMessage = i18n.t('FORM_THIS_FIELD_IS_REQUIRED');

  const validateVisitorInfo = (key, array, path, createError) => {
    const data = array.filter((item, index) => array.length > 0 && index === 0 && !item.key)[0];
    const haveData = data ? data[key] : false;
    return haveData || createError({ path: `${path}.${0}.${key}`, message: requiredMessage });
  };

  const validationSchema = Yup.object().shape({
    reasonForVisit: Yup.string().required(requiredMessage),
    numberOfVisitors: Yup.number().required(requiredMessage).min(1, i18n.t('COMMON_VALIDATE_POSITIVE')),
    visitorInformations: Yup.array()
      .test('visitorInformations', requiredMessage, function () {
        return validateVisitorInfo('name', this.parent.visitorInformations, this.path, this.createError);
      })
      .test('visitorInformations', requiredMessage, function () {
        return validateVisitorInfo('phone', this.parent.visitorInformations, this.path, this.createError);
      }),
  });

  const onPressAddVisitor = () => {
    const { values } = formikRef.current;
    formikRef.current.setFieldValue('visitorInformations', [...values.visitorInformations, {}]);
  };

  const onPressRemoveVisitor = (index) => {
    const { values } = formikRef.current;
    formikRef.current.setFieldValue(
      'visitorInformations',
      values.visitorInformations.filter((_item, idx) => idx !== index)
    );
  };

  const onSubmit = async ({ images, registerTime, registerCheckOutTime, reasonForVisit, ...values }) => {
    const checkInTime = registerTime ? moment(registerTime, dateTimeFormat).toDate() : registerTime;
    const checkOutTime = registerCheckOutTime
      ? moment(registerCheckOutTime, dateTimeFormat).toDate()
      : registerCheckOutTime;

    actions.visitor.createVisitor({
      ...values,
      unitId: unitActive.unitId,
      buildingId: unitActive.buildingId,
      floorId: unitActive.floorId,
      fullUnitId: unitActive.fullUnitCode,
      imageList: images,
      tenantId: tenant.id,
      registerTime: checkInTime,
      registerCheckOutTime: checkOutTime,
      reasonForVisit: { id: reasonForVisit },
    });
  };

  const formatVisitorDateTime = (dateStr) => (dateStr ? moment(dateStr).toDate() : undefined);

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }

    return {
      visitorInformations: detailVisitor.visitorInformations,
      numberOfVisitors: detailVisitor.numberOfVisitors,
      registerTime: formatVisitorDateTime(detailVisitor.registerTime),
      registerCheckOutTime: formatVisitorDateTime(detailVisitor.registerCheckOutTime),
      description: detailVisitor.description,
      reasonForVisit: detailVisitor.reasonForVisit.id,
      visitorType: detailVisitor.visitorType,
      images: files || [],
    };
  };

  const baseLayoutProps = {
    showBell: false,
    title: isAddNew ? 'VS_NEW' : 'VS_EDIT',
  };

  if (!isAddNew && !detailVisitor) return <BaseLayout {...baseLayoutProps} />;

  return (
    <Formik
      initialValues={{
        registerTime: undefined,
        registerCheckOutTime: undefined,
        description: '',
        reasonForVisit: 1,
        numberOfVisitors: 0,
        visitorInformations: [{}],
        visitorType: 0,
        images: [],
        ...getInitialValuesForUpdate(),
      }}
      innerRef={formikRef}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {(props) => {
        const {
          values: { visitorInformations },
          handleSubmit,
        } = props;

        return (
          <Form testID="add-or-edit-visitor">
            <AwareScrollView>
              <CardWrapper>
                <FormInput
                  required
                  editable={isAddNew}
                  label="VS_NUM_OF_VISITOR"
                  placeholder="VS_NUM_OF_VISITOR"
                  name="numberOfVisitors"
                  keyboardType="number-pad"
                />
                <FormRadioGroup
                  required
                  label="VISITOR_TYPE"
                  labelFirst={false}
                  name="visitorType"
                  options={visitorTypes}
                  editable={isAddNew}
                />
                {visitorInformations.length > 0 && (
                  <>
                    <VisitorWrapper center>
                      <Text preset="bold" text={i18n.t('VS_INFORMATION')} />
                      <ButtonExpand expanded={expanded} onPress={setExpand} />
                    </VisitorWrapper>
                    <View>
                      {visitorInformations.length > 0 && !expanded ? (
                        <FieldArray
                          name="visitorInformations"
                          render={() => (
                            <View testID="visitor-informations">
                              {visitorInformations.map((_item, index) => {
                                const firstItem = index === 0;
                                return (
                                  <View key={index.toString()}>
                                    <FormInput
                                      testID="visitor-name"
                                      required={firstItem}
                                      editable={isAddNew}
                                      rightButton={
                                        !firstItem && isAddNew ? (
                                          <ButtonClose
                                            testID="remove-visitor-button"
                                            onPress={() => onPressRemoveVisitor(index)}
                                          >
                                            <Ionicons name="close-outline" color={Colors.azure} size={20} />
                                          </ButtonClose>
                                        ) : null
                                      }
                                      label={i18n.t('VS_NEW_INFO_NAME', undefined, index + 1)}
                                      placeholder="VS_NEW_INFO_NAME_HOLDER"
                                      name={`visitorInformations.${index}.name`}
                                    />
                                    <Row>
                                      <FormInput
                                        testID="visitor-phone"
                                        containerStyle={phoneInputStyles}
                                        required={firstItem}
                                        editable={isAddNew}
                                        label="VS_NEW_INFO_PHONE"
                                        keyboardType="number-pad"
                                        placeholder="VS_NEW_INFO_PHONE_HOLDER"
                                        name={`visitorInformations.${index}.phone`}
                                      />
                                      <FormInput
                                        testID="visitor-id"
                                        containerStyle={IDInputStyles}
                                        editable={isAddNew}
                                        keyboardType="number-pad"
                                        label="VS_NEW_INFO_ID"
                                        maxLength={4}
                                        placeholder="VS_NEW_INFO_ID_HOLDER"
                                        name={`visitorInformations.${index}.identityCardNumber`}
                                      />
                                    </Row>
                                  </View>
                                );
                              })}
                            </View>
                          )}
                        />
                      ) : null}
                    </View>
                  </>
                )}
                {isAddNew && !expanded ? (
                  <>
                    <BtnAddWrapper center>
                      <ButtonAdd testID="add-visitor-button" onPress={onPressAddVisitor}>
                        <Ionicons name="add-circle" color={Colors.azure} size={20} />
                      </ButtonAdd>
                      <Text preset="bold" text={i18n.t('VISITOR_ADD')} />
                    </BtnAddWrapper>
                  </>
                ) : null}

                <FormDate
                  disabled={!isAddNew}
                  label="VS_NEW_INFO_TIME1"
                  placeholder="VS_NEW_INFO_TIME1"
                  name="registerTime"
                  mode="datetime"
                />
                <FormDate
                  disabled={!isAddNew}
                  label="VS_NEW_INFO_TIME2"
                  placeholder="VS_NEW_INFO_TIME2"
                  name="registerCheckOutTime"
                  mode="datetime"
                />
                <FormDropdown
                  disabled={!isAddNew}
                  required
                  options={listType}
                  label="VISITOR_PURPOSE_OF_VISIT"
                  placeholder=""
                  name="reasonForVisit"
                />
                <FormInput editable={isAddNew} label="FB_PROBLEM" placeholder="" name="description" multiline />
                <FormDocumentPicker
                  allowAddDocument={isAddNew}
                  allowDeleteDocument={isAddNew}
                  name="images"
                  label="COMMON_DOCUMENT"
                />
                {isAddNew && (
                  <Button testID="submit-button" title="AD_COMMON_SAVE" primary rounded onPress={handleSubmit} />
                )}
              </CardWrapper>
            </AwareScrollView>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Connect(TabDetailInfo);
