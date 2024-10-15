import React from 'react';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import Section from './Section';

const Sections = ({ list, onPressItem, ...props }) => (
  <AwareScrollView>
    {list.map((item, index) => (
      <Section key={item.id} index={index} item={item} list={list} onPress={onPressItem} {...props} />
    ))}
  </AwareScrollView>
);

export default Sections;
