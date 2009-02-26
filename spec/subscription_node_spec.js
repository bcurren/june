require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("SubscriptionNode", function() {
    var node;
    before(function() {
      node = new June.SubscriptionNode();
    });

    describe("#publish", function() {
      it("invokes functions registered with #subscribe", function() {
        var fn_1 = mock_function();
        var fn_2 = mock_function();

        node.subscribe(fn_1);
        node.subscribe(fn_2);

        node.publish("foo");
        expect(fn_1).to(have_been_called, with_args("foo"));
        expect(fn_2).to(have_been_called, with_args("foo"));


        node.publish("bar", "baz");
        expect(fn_1).to(have_been_called, with_args("bar", "baz"));
        expect(fn_2).to(have_been_called, with_args("bar", "baz"));
      });
    });
  });
}});