import React, { useEffect } from 'react';
import JailMonkey from 'jail-monkey';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { withModal } from '../../HOC';

const Container = styled.View``;

const Content = styled(Text)`
  margin-bottom: 20px;
`;

const DisclaimerContent = () => (
  <Container>
    <Content text="ROOT_DISCLAIMER_CONTENT" />
  </Container>
);

const DisclaimerModal = withModal(DisclaimerContent, 'ROOT_DISCLAIMER_TITLE');

function RootChecker({ onCompleted }) {
  const isRooted = JailMonkey.isJailBroken();
  useEffect(() => {
    if (!isRooted) {
      onCompleted();
    }
  }, [isRooted]);

  const visible = isRooted;
  if (visible) {
    return <DisclaimerModal visible />;
  }

  return null;
}

export default RootChecker;
