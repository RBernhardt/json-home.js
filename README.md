# json-home.js

Javascript library for JSON Home Documents

Home Documents for HTTP APIs ([http://tools.ietf.org/html/draft-nottingham-json-home-02](http://tools.ietf.org/html/draft-nottingham-json-home-02))

## Requires

jQuery [Pull requests for a jQuery-less version are welcome.]

## Examples

### JSON Home Example (example.json)

    {
        "resources": {
            "http://example.org/rel/widgets": {
                "href": "/widgets/"
            },
            "http://example.org/rel/widget": {
                "href-template": "/widgets/{widget_id}",
                "href-vars": {
                    "widget_id": "http://example.org/param/widget"
                },
                "hints": {
                    "allow": ["GET", "PUT", "DELETE", "PATCH"],
                    "representations": ["application/json"],
                    "accept-patch": ["application/json-patch"],
                    "accept-post": ["application/xml"],
                    "accept-ranges": ["bytes"]
                }
            }
        }
    }

### Loading JSON Home

    $.getJsonHome({
        url:"example.json",
        success: function(jsonHome) {
            // handling success
        }
    });

### Getting HREF

    jsonHome.get("http://example.org/rel/widgets").getHref();
    // Output: /widgets/

similar to

    jsonHome.getHref("http://example.org/rel/widgets");
    // Output: /widgets/

### Resolving HREF-Template

    jsonHome.getHref("http://example.org/rel/widget", {"http://example.org/param/widget" : 123456});
    // Output: /widgets/123456

### Handling AJAX Errors

    $.getJsonHome({
        url:"example.json",
        success: function(jsonHome) {
            // handling success
        },
        error: function(xhr, msg, e) {
            // handling ajax errors (similar to jQuery ajax errors)
        }
    });

## Licensing

The project is released under version 2.0 of the Apache License. See LICENSE.txt for details.

