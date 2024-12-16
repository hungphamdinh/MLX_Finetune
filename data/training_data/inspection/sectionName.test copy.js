import React, { Fragment } from 'react';
import styled from 'styled-components';
import { IconButton, Text } from '@Elements';
import Row from '@Components/Grid/Row';
import { Colors } from '@Themes';
import { FormInput } from '@Components/Forms';
import { modal } from '@Utils';

import _ from 'lodash';

const SectionInput = styled(FormInput)`
  width: 80%;
`;

const SectionName = ({ item, onRemoveSection, index, name, updateField }) => {
  const [allowEdit, setAllowEdit] = React.useState(false);
  const [sectionName, setSectionName] = React.useState(item.name);
  const fieldName = `${name}.${index}`;

  const removeSection = () => {
    onRemoveSection(index);
  };

  const changeAllowEdit = () => {
    if (!_.size(sectionName)) {
      modal.showError('FORM_THIS_FIELD_IS_REQUIRED');
      return;
    }
    setAllowEdit(!allowEdit);
    updateField(index, {
      name: sectionName,
    });
  };

  const onChangeText = (text) => {
    setSectionName(text);
  };

  return (
    <Fragment>
      {!allowEdit ? (
        <Text preset="bold" text={item.name} />
      ) : (
        <SectionInput testID="textInput" onChangeText={onChangeText} mode="small" label="" name={`${fieldName}.name`} />
      )}
      <Row>
        <IconButton
          testID="buttonCreate"
          onPress={changeAllowEdit}
          name={allowEdit ? 'save-outline' : 'create-outline'}
          size={20}
          color={Colors.azure}
        />
        <IconButton testID="buttonRemove" onPress={removeSection} name="close-circle" size={20} color={Colors.azure} />
      </Row>
    </Fragment>
  );
};

export default SectionName;
