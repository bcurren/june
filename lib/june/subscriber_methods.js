module("June", function(c) { with(c) {
  module("SubscriberMethods", function() {
    def("subscribe", function(){
      this.on_insert_node = new June.SubscriptionNode();
      this.on_remove_node = new June.SubscriptionNode();
      this.on_update_node = new June.SubscriptionNode();

      var self = this;
      this.on_insert_node.on_unsubscribe(function() {
        self.unsubscribe_from_operand_if_no_longer_needed();
      });
      this.on_remove_node.on_unsubscribe(function() {
        self.unsubscribe_from_operand_if_no_longer_needed();
      });
      this.on_update_node.on_unsubscribe(function() {
        self.unsubscribe_from_operand_if_no_longer_needed();
      });
    });
  });
}});