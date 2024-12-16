import React, { Fragment } from 'react';
import styled from 'styled-components/native';
import { FormDropdown } from '@Components/Forms';
import SectionName from '../SectionName';

const SectionItem = styled.TouchableOpacity`
  padding: 10px;
  background-color: white;
  border-radius: 20px;
  margin-bottom: 10px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const SectionDropdown = styled.View`
  padding-horizontal: 10px;
`;

const Section = ({ item, onRemoveSection, index, name, list, updateField, formPages }) => {
  const [sectionVisible, setSectionVisible] = React.useState(false);
  const [disabledFormPages, setDisabledFormPages] = React.useState([]);

  const fieldName = `${name}.${index}`;
  const formPagesSelectedName = `${fieldName}.formPages`;

  const onSelectSection = (val) => {
    updateField(index, {
      formPages: val,
    });
  };

  const changeSectionVisible = () => {
    setSectionVisible(!sectionVisible);
  };

  const onDropdownVisible = () => {
    let allSelectedFormPages = [];
    const selectedFormPages = [];
    list.forEach((child) => {
      child.formPages.forEach((pageSelected) => {
        const currentPage = item.formPages.find((page) => page.id === pageSelected.id);
        if (!currentPage) {
          selectedFormPages.push(pageSelected);
        }
      });
      allSelectedFormPages = allSelectedFormPages.concat([...selectedFormPages.map((page) => page.id)]);
    });
    setDisabledFormPages(allSelectedFormPages);
  };

  const commonProps = {
    item,
    updateField,
    index,
    name,
  };

  return (
    <Fragment>
      <SectionItem testID="sectionButton" onPress={changeSectionVisible}>
        <SectionName testID="sectionName" onRemoveSection={onRemoveSection} {...commonProps} />
      </SectionItem>
      {sectionVisible && (
        <SectionDropdown>
          <FormDropdown
            showSearchBar
            showCheckAll={false}
            multiple
            name={formPagesSelectedName}
            options={formPages}
            onChange={onSelectSection}
            lockValues={disabledFormPages}
            showValue={false}
            onDropdownVisible={onDropdownVisible}
            valKey="id"
            testID="formDropdown"
          />
        </SectionDropdown>
      )}
    </Fragment>
  );
};

export default Section;
