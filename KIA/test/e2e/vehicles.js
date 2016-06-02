describe("E2E: Dealer Inventory", function() {

  beforeEach(function() {
    browser.get('/vehicles');
  });

  it('should have a working vehicles page controller that applies the vehicles to the scope', function() {
  	var elems = element.all(by.repeater('vehicle in vehicles'));
  	expect(elems.count()).toBe(10);
  });

});