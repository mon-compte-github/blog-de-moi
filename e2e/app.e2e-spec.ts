import { BlogDeMoiPage } from './app.po';

describe('blog-de-moi App', () => {
  let page: BlogDeMoiPage;

  beforeEach(() => {
    page = new BlogDeMoiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
