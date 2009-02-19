require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("SubscriptionNode", function() {
    var node;
    before(function() {
      node = new June.SubscriptionNode();
    });

    describe("#publish", function() {
      it("invokes functions registered with #subscribe", function() {
        var subscription_1_args = []

        node.subscribe(function() {
          subscription_1_args.push(new Array(arguments))
        });


        node.subscribe(fn_2);
        
        node.publish("foo", "bar");

        expect(fn_1).to(have_been_called);
        expect(fn_2).to(have_been_called);
      });
    });
  });
}});