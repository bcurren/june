//= require <foundation>
//= require <jquery-1.2.6>
//= require <json>

//= require "june/tuple_methods"
//= require "june/predicates"
//= require "june/relations"
//= require "june/attribute"
//= require "june/composite_tuple"
//= require "june/domain"
//= require "june/remote_domain"
//= require "june/field"
//= require "june/string"
//= require "june/subscription"
//= require "june/subscription_node"
//= require "june/subscription_bundle"

module("June", function(c) { with(c) {
  def('remove', function(array, element) {
    var tuple_index = array.indexOf(element);
    if (tuple_index == -1) return null;
    array.splice(tuple_index, 1);
    return element;
  });

  def("map", function(array, fn) {
    var results = [];
    this.each(array, function(){
      results.push(fn.call(this, this));
    });
    return results;
  });
  
  def('each', function(array, fn) {
    for(var i = 0; i < array.length; i++) {
      fn.call(array[i], array[i]);
    }
  });

  def('GlobalDomain', new June.Domain());

  def("define_set", function(name, definition) {
    return this.GlobalDomain.define_set(name, definition);
  });

  def("remote", function(url) {
    return new June.RemoteDomain(url); 
  });

  def("origin", function(url) {
    var remote_domain = this.remote(url);
    this.Origin = remote_domain;
    return remote_domain;
  });

  def("pull", function(relations, pull_callback) {
    this.Origin.pull(relations, pull_callback);
  })
}});