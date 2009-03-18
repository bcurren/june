module("June", function(c) { with(c) {
  def('remove', function(array, element) {
    var tuple_index = array.indexOf(element);
    if (tuple_index == -1) return null;
    array.splice(tuple_index, 1);
    return element;
  });
}});