describe("JsonHome", function() {

    it("should create json-home object", function() {
        spyOn($, 'ajax').and.callFake(function (params) {
            params.success({
                "resources": {
                    "http://spec.newsarea.de/rel/test-rel": {
                        "href": "/airplanes/main/position"
                    },
                    "http://spec.newsarea.de/rel/test-abs": {
                        "href": "http://localhost:8080/airplanes/main/position"
                    }
                }
             });
        });
        // ~
        $.getJsonHome({
            url: "http://localhost:8080/index",
            success: function(jsonHome) {
                expect(jsonHome.getHref("http://spec.newsarea.de/rel/test-rel", {})).toEqual("http://localhost:8080/airplanes/main/position");
                expect(jsonHome.getHref("http://spec.newsarea.de/rel/test-abs", {})).toEqual("http://localhost:8080/airplanes/main/position");
            }
        });

    });

});
