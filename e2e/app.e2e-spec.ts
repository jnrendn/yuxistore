import { YuxisnacksPage } from './app.po';

describe('yuxisnacks App', () => {
  let page: YuxisnacksPage;

  beforeEach(() => {
    page = new YuxisnacksPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
