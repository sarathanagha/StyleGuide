describe('navigate to /vehicles', function() {
  var link;

  beforeEach(function() {
  	browser.get('/');
    link = element(by.css('#bs-example-navbar-collapse-1 ul#l1Nav li:nth-child(1)'));
    link.click();
  });

  it('should navigate to the /vehicles page when clicking', function() {
    expect(browser.getCurrentUrl()).toMatch('/vehicles');
  });

});