import { SplitUserEmailPipe } from './split-user-email.pipe';

describe('SplitUserEmailPipe', () => {
  it('create an instance', () => {
    const pipe = new SplitUserEmailPipe();
    expect(pipe).toBeTruthy();
  });
});
