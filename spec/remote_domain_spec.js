require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("RemoteDomain", function() {
    var remote;
    before(function() {
      remote = new June.RemoteDomain("/domain");
    });

    describe("#update", function() {
      it("sends a PUT request to the RemoteDomain's url with a JSON representation of the tuple to update and the attributes, then updates the tuple with the results and runs the callback", function() {
        var tuple = User.find("dan");
        var old_first_name = tuple.first_name();


        mock(jQuery, "ajax");
        var update_callback = mock_function("update callback", function(tuple_arg) {
          expect(tuple_arg).to(equal, tuple);
          expect(tuple.first_name()).to(equal, "Danny");
        });

        remote.update(tuple, { first_name: "Danny" }, update_callback);

        expect(jQuery.ajax).to(have_been_called, once);
        ajax_hash = jQuery.ajax.most_recent_args[0];

        expect(ajax_hash.url).to(equal, remote.url);
        expect(ajax_hash.type).to(equal, "PUT");
        expect(JSON.parse(ajax_hash.data.tuple)).to(equal, { set: "users", id: "dan" });
        expect(JSON.parse(ajax_hash.data.attribute_values)).to(equal, { first_name: "Danny" });

        expect(tuple.first_name()).to(equal, old_first_name);

        ajax_hash.success(JSON.stringify({
          id: "dan",
          first_name: "Danny",
          age: 21
        }));

        expect(update_callback).to(have_been_called, once);
        expect(tuple.first_name()).to(equal, "Danny");
      });
    });

    describe("#pull", function() {
      it("calls #update on June.GlobalDomain with the results of #fetch", function() {
        var snapshot = {
          "users": {
            "stephanie": {
              "id": "stephanie",
              "first_name": "Stephanie"
            }
          }
        };

        mock(remote, "fetch");
        var pull_callback = function() {};
        remote.pull([User], pull_callback);
        expect(remote.fetch).to(have_been_called, once)
        var fetch_callback = remote.fetch.most_recent_args[1];

        mock(June.GlobalDomain, "update");
        fetch_callback(snapshot);
        expect(June.GlobalDomain.update).to(have_been_called, with_args(snapshot, pull_callback));
      });
    });

    describe("#fetch", function() {
      it("sends a GET request to the RemoteDomain's url with a JSON wire representation of the given relations and returns a JSON snapshot of its results", function() {
        var mock_server_response = {
          'users': {
            'jan': {
              'id': 'jan'
            }
          }
        }

        mock(jQuery, "ajax", function() {
          return JSON.stringify(mock_server_response);
        });

        var users = User.where(User.age.eq(21));
        var pets = users.join(Pet).on(Pet.owner_id.eq(User.id)).project(User);

        var fetch_callback = mock_function("fetch callback");
        remote.fetch([users, pets], fetch_callback);

        expect(jQuery.ajax).to(have_been_called, once);
        var ajax_hash = jQuery.ajax.most_recent_args[0]

        expect(ajax_hash.url).to(equal, remote.url);
        expect(ajax_hash.type).to(equal, "GET");
        expect(ajax_hash.data.relations).to(equal, JSON.stringify([users.wire_representation(), pets.wire_representation()]));

        ajax_hash.success(JSON.stringify(mock_server_response));
        expect(fetch_callback).to(have_been_called, with_args(mock_server_response));
      });
    });
  });
}});