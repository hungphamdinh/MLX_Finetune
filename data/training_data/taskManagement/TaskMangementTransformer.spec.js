import { transformMentionMessage } from './TaskMangementTransformer';

describe('transformMentionMessage', () => {
  it('should transform mentions from [Name](id1,id2) format to <id1,id2>', () => {
    const originalMessage = '@[David Tabaka](70,13) and @[Thien](70,6) are good';
    const expectedMessage = '@<70,13> and @<70,6> are good';
    expect(transformMentionMessage(originalMessage)).toBe(expectedMessage);
  });

  it('should return an empty string if input is empty', () => {
    expect(transformMentionMessage('')).toBe('');
  });

  it('should return the same string if there are no mentions to transform', () => {
    const originalMessage = 'No mentions here!';
    expect(transformMentionMessage(originalMessage)).toBe(originalMessage);
  });

  it('should handle mixed content with and without mentions', () => {
    const originalMessage = 'Hello @[John](1,2)! Meet @[Jane](3,4).';
    const expectedMessage = 'Hello @<1,2>! Meet @<3,4>.';
    expect(transformMentionMessage(originalMessage)).toBe(expectedMessage);
  });
});
