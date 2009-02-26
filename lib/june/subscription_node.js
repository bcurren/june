module("June", function(c) { with(c) {
  constructor("SubscriptionNode", function() {
    def('initialize', function() {
      this.subscriptions = [];
    });

    def('subscribe', function(fn) {
      this.subscriptions.push(fn);
    });

    def('publish', function() {
      var publish_arguments = arguments;
      jQuery.each(this.subscriptions, function() {
        this.apply(null, publish_arguments);
      })
    })
  });
}});