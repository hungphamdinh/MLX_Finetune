def convert_code_to_string(code):
    # Convert the code into a string format
    code_string = "<code>" + code.replace("\n", "\\n").replace("\"", "\\\"") + "</code>"
    return code_string

if __name__ == "__main__":
    # Define the code snippet you want to convert
    code_snippet = """import React from 'react';
import { Image, Text } from '@Elements';
import { ImageResource } from '@Themes';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-top: 80px;
`;

const Content = styled(Text)`
  color: #505e75;
  font-weight: bold;
  font-size: 13px;
`;

const EmptyList = () => (
  <Wrapper>
    <Image testID="image" source={ImageResource.IMG_LIBRARY_EMPTY} />
    <Content testID="text" text="AD_EFORM_NO_IMAGES_AVAILABLE" />
  </Wrapper>
);

export default EmptyList;
"""
    component_string = convert_code_to_string(code_snippet)

   # Print the output
print(component_string)
