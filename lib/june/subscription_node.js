module("June", function(c) { with(c) {
  constructor("SubscriptionNode", function() {
    def('initialize', function() {
      this.subscriptions = [];
    });

    def('subscribe', function(handler) {
      this.subscriptions.push(handler);
    });

    def('publish', function() {
      var publish_arguments = arguments;
      jQuery.each(this.subscriptions, function() {
        this.apply(null, publish_arguments);
      })
    })

    def('is_empty', function() {
      return this.subscriptions.length == 0;
    });
  });
}});