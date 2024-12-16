// FeedbackForm.jsx
import React from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { TextInput, Button, Text } from '@components/Commons';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFeedback from '@Context/Feedback/Hooks/UseFeedback';

const FormContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const InputField = styled(TextInput)`
  margin-bottom: 15px;
`;

const ErrorText = styled(Text)`
  color: red;
  margin-bottom: 10px;
`;

const FeedbackForm = ({ testID }) => {
  const { submitFeedback, feedbackError, isSubmitting } = useFeedback();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('NAME_REQUIRED'),
    email: Yup.string().email('INVALID_EMAIL').required('EMAIL_REQUIRED'),
    message: Yup.string().min(10, 'MESSAGE_MIN').required('MESSAGE_REQUIRED'),
  });

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const { handleSubmit, formState: { errors } } = formMethods;

  const onSubmit = (data) => {
    submitFeedback(data);
  };

  return (
    <FormProvider {...formMethods}>
      <ScrollView testID={testID}>
        <FormContainer>
          <InputField
            name="name"
            placeholder="Your Name"
            testID="feedback-name"
          />
          {errors.name && <ErrorText text={errors.name.message} testID="error-name" />}

          <InputField
            name="email"
            placeholder="Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            testID="feedback-email"
          />
          {errors.email && <ErrorText text={errors.email.message} testID="error-email" />}

          <InputField
            name="message"
            placeholder="Your Feedback"
            multiline
            numberOfLines={4}
            testID="feedback-message"
          />
          {errors.message && <ErrorText text={errors.message.message} testID="error-message" />}

          {feedbackError && <ErrorText text={feedbackError} testID="error-feedback" />}

          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit'}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            testID="feedback-submit-button"
          />
        </FormContainer>
      </ScrollView>
    </FormProvider>
  );
};

export default FeedbackForm;