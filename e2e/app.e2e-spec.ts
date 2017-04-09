import { Ng2048Page } from './app.po';

describe('ng2048 App', () => {
  let page: Ng2048Page;

  beforeEach(() => {
    page = new Ng2048Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
