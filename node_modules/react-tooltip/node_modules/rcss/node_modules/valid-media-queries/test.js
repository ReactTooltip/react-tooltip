var mediaQueryValidator = require('./index.js');

var assert = require("assert");


describe('mediaQueryValidator', function() {

    it('should allow for qualifiers', function() {
        var query = "@media not all and (monochrome)";
        assert.equal(true, mediaQueryValidator(query));
    });

    it('should allow for multiple terms', function() {
        var query = "@media not all and (monochrome),"
            + " only screen and (color:256px) and (min-monochrome)";
        assert.equal(true, mediaQueryValidator(query));
    });

    it('should allow for media type w/o feature', function() {
        var query = "@media tv and (monochrome), only screen";
        assert.equal(true, mediaQueryValidator(query));
    });

    it('should ignore case', function() {
        var query = "@meDia TV and (max-heIGHT:50px)";
        assert.equal(true, mediaQueryValidator(query));
    });

    it('should ignore spaces', function() {
        var query = "@media   screen  and (  max-height : 50px ), only tv";
        assert.equal(true, mediaQueryValidator(query));
    });

    it('should not allow invalid features', function() {
        var query = "@media not screen  and (max-hate : 50px), only tv";
        assert.equal(false, mediaQueryValidator(query));
    });

    it('should not allow invalid media types', function() {
        var query = "@media not thing  and (max-height : 50px)";
        assert.equal(false, mediaQueryValidator(query));
    });

    it('should not allow invalid values for integer features', function() {
        var query = "@media not screen and (max-height : hello)";
        assert.equal(false, mediaQueryValidator(query));
    });

    it('should not allow invalid values for orientation features', function() {
        var query = "@media screen and (max-height : 12px), (orientation:5dpi)";
        assert.equal(false, mediaQueryValidator(query));
    });

    it('should not allow invalid values for spaces in integers', function() {
        var query = "@media screen and (max-height : 12 px)";
        assert.equal(false, mediaQueryValidator(query));
    });

    it('should accept valid resolutions', function() {
        var query = "@media screen and (resolution : -2.5dpi)";
        assert.equal(true, mediaQueryValidator(query));
    });

    it('should not accept invalid resolutions', function() {
        var query = "@media screen and (resolution : -2. dpi)";
        assert.equal(false, mediaQueryValidator(query));
    });
});
