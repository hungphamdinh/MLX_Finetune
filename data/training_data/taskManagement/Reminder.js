import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import { FormProvider } from 'react-hook-form';
import styled from 'styled-components/native';
import ItemUserEmail from './ItemUserEmail';
import { FormNumberInput, FormSwitch, FormInput, FormLazyDropdown } from '@Components/Forms';
import I18n from '@I18n';
import { IconButton, Tag } from '@Elements';
import { validateEmail } from '@Utils/common';
import LocaleConfig from '@Config/LocaleConfig';
import { Colors } from '@Themes';
import { modal } from '@Utils';
import useApp from '@Context/App/Hooks/UseApp';
import Row from '../Grid/Row';
import _ from 'lodash';
import { useCompatibleForm } from '../../Utils/hook';
import { defaultCost } from '../../Config/Constants';

const RemindersContainer = styled.View`
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const Section = styled.View`
  margin-bottom: 16px;
`;

const AddButton = styled.View`
  position: absolute;
  right: 0;
  top: 25px;
`;

const Reminder = ({
  disabled = false,
  configure = { hidePeriod: true, timeUnit: 'DAY' },
  maximumRemindersAfter = 1,
  initialValues = null,
  onChange,
  allowReminderAfter = true,
  allowReminderBefore = true,
}) => {
  const formMethods = useCompatibleForm({
    defaultValues: {
      ...initialValues,
      newReminderBefore: defaultCost,
      newReminderAfter: defaultCost,
    },
  });

  const { setValue, watch } = formMethods;

  const {
    getEmployees,
    app: { employees },
  } = useApp();

  const reminderInMinutes = watch('reminderInMinutes') || [];
  const reminderInMinutesAfter = watch('reminderInMinutesAfter') || [];
  const emails = watch('emails') || [];
  const isActive = watch('isActive');
  const [timeUnitSuffix, setTimeUnitSuffix] = React.useState('');

  const initValue = (isActive) => {
    setValue('newReminderBefore', defaultCost);
    setValue('newReminderAfter', defaultCost);
    getListEmployees(1);

    if (!isActive) {
      setValue('reminderInMinutes', []);
      setValue('reminderInMinutesAfter', []);
      setValue('emails', []);
      setValue('users', []);
      return;
    }
  };

  React.useEffect(() => {
    getEmployees({
      page: 1
    });
  }, [])

  React.useEffect(() => {
    if(initialValues) {
      formMethods.reset(initialValues);
    }
  }, [initialValues]);

  // Update timeUnitSuffix based on configure.timeUnit
  useEffect(() => {
    switch (configure.timeUnit) {
      case 'DAY':
        setTimeUnitSuffix(I18n.t('TIME_UNIT_DAYS'));
        break;
      case 'HOUR':
        setTimeUnitSuffix(I18n.t('TIME_UNIT_HOURS'));
        break;
      default:
        setTimeUnitSuffix(I18n.t('TIME_UNIT_MINUTES'));
    }
  }, [configure.timeUnit]);

  const readingOptions = {
    precision: 0,
    separator: LocaleConfig.decimalSeparator,
    delimiter: LocaleConfig.groupSeparator,
    unit: '',
    suffix: '',
  };

  const convertToMinutes = (value) => {
    switch (configure.timeUnit) {
      case 'DAY':
        return value * 24 * 60;
      case 'HOUR':
        return value * 60;
      default:
        return value;
    }
  };

  const convertMinutesToUnit = (minutes) => {
    switch (configure.timeUnit) {
      case 'DAY':
        return minutes / (24 * 60);
      case 'HOUR':
        return minutes / 60;
      default:
        return minutes;
    }
  };

  const addReminder = (type) => {
    const fieldName = type === 'before' ? 'newReminderBefore' : 'newReminderAfter';
    const reminderField = type === 'before' ? 'reminderInMinutes' : 'reminderInMinutesAfter';
    const currentReminders = type === 'before' ? reminderInMinutes : reminderInMinutesAfter;

    const rawInput = watch(fieldName).rawValue;
    const value = parseInt(rawInput, 10);

    const convertedValue = convertToMinutes(value);

    if (currentReminders.includes(convertedValue)) {
      modal.showError(I18n.t('DUPLICATE_REMINDER_VALUE'));
      return;
    }

    setValue(
    reminderField,
      [...currentReminders, convertedValue].sort((a, b) => a - b)
    );
    setValue(fieldName, '');
  };

  const removeEmail = (email) => {
    setValue(
      'emails',
      emails.filter((e) => e !== email)
    );
  };

  const onCheckEmail = () => {
    const userEmail = watch('userEmail');
    if (!validateEmail(userEmail)) {
      modal.showError(I18n.t('COMMON_EMAIL_VALIDATION'));
    } else {
      addEmailAndResetInput(userEmail);
    }
  };

  const addEmailAndResetInput = (userEmail) => {
    setValue('emails', [...emails, userEmail]);
    setValue('userEmail', '');
  };

  const disabledReminderBefore =
    !watch('newReminderBefore')?.rawValue || reminderInMinutes.length >= maximumRemindersAfter;
  const disabledReminderAfter =
    !watch('newReminderAfter')?.rawValue || reminderInMinutesAfter.length >= maximumRemindersAfter;

  const handleRemove = (type, index) => {
    const filter = (list) => list.filter((_item, idx) => idx !== index);
    const reminderName = type === 'before' ? 'reminderInMinutes' : 'reminderInMinutesAfter';
    const reminders = type === 'before' ? reminderInMinutes : reminderInMinutesAfter;

    setValue(reminderName, filter(reminders));
  };

  const getListEmployees = (page, keyword) => {
    getEmployees({
      page,
      keyword,
    });
  };

  const tagProps = {
    containerStyle: { marginRight: 8, backgroundColor: Colors.azure },
    textStyle: { color: 'white' },
  };

  // Notify parent component on form changes
  useEffect(() => {
    const subscription = watch((value) => {
      if (onChange) {
        onChange(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <FormProvider {...formMethods}>
      <View>
        <FormSwitch
          name="isActive"
          value={isActive}
          label={'REMINDER'}
          onValueChange={(val) => initValue(val)}
          disabled={disabled}
          testID="switch-isActive"
        />
        {isActive && (
          <RemindersContainer>
            {allowReminderBefore && (
              <Section>
                <FormNumberInput
                  name="newReminderBefore"
                  label="REMINDER_BEFORE"
                  placeholder={timeUnitSuffix}
                  textOptions={readingOptions}
                  maxLength={null}
                  mode="small"
                />
                <AddButton>
                  <IconButton
                    disabled={disabledReminderBefore}
                    onPress={() => addReminder('before')}
                    name="add-circle"
                    color={disabledReminderBefore ? Colors.disabled : Colors.azure}
                  />
                </AddButton>
                <Row>
                  {reminderInMinutes.map((item, index) => (
                    <Tag
                      key={index}
                      showDelete
                      {...tagProps}
                      testID={`reminder-in-minutes-${index}`}
                      text={convertMinutesToUnit(item)}
                      onPressRemove={() => handleRemove('before', index)}
                    />
                  ))}
                </Row>
              </Section>
            )}

            {allowReminderAfter && (
              <Section>
                <FormNumberInput
                  name="newReminderAfter"
                  label="REMINDER_AFTER"
                  placeholder={timeUnitSuffix}
                  textOptions={readingOptions}
                  editable={!disabled}
                  maxLength={null}
                  mode="small"
                />
                <AddButton>
                  <IconButton
                    disabled={disabledReminderAfter}
                    onPress={() => addReminder('after')}
                    name="add-circle"
                    color={disabledReminderAfter ? Colors.disabled : Colors.azure}
                  />
                </AddButton>
                <Row>
                  {reminderInMinutesAfter.map((item, index) => (
                    <Tag
                      key={index}
                      showDelete
                      testID={`reminder-in-minutes-after-${index}`}
                      {...tagProps}
                      text={convertMinutesToUnit(item)}
                      onPressRemove={() => handleRemove('after', index)}
                    />
                  ))}
                </Row>
              </Section>
            )}

            <FormLazyDropdown
              listExist={employees.data}
              showSearchBar
              getList={(page, keyword) => getListEmployees(page, keyword)}
              options={employees}
              title="ADD_USER_TO_NOTIFICATION"
              label="ADD_USER_TO_NOTIFICATION"
              fieldName="displayName"
              titleKey="displayName"
              multiple
              name="users"
            />

            <FormInput
              label="IV_ADD_EMAIL_TO_NOTIFICATION"
              name="userEmail"
              placeholder="IV_ADD_EMAIL_TO_NOTIFICATION"
              mode="noBorder"
              rightIcon={<IconButton onPress={onCheckEmail} name="add-outline" color={Colors.text} />}
            />
            {emails.length > 0 && (
              <>
                {emails.map((item, index) => (
                  <ItemUserEmail testID={`item-user-email-${index}`} key={index.toString()} onPressRemove={() => removeEmail(index)} item={item} />
                ))}
              </>
            )}
          </RemindersContainer>
        )}
      </View>
    </FormProvider>
  );
};

export default Reminder;
