function isValidRatio(ratio) {
    var re = /\d+\/\d+/;
    return !!ratio.match(re);
}

function isValidInteger(integer) {
    var re = /\d+/;
    return !!integer.match(re);
}

function isValidLength(length) {
    var re = /\d+(?:ex|em|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?$/;
    return !!length.match(re);
}

function isValidOrientation(orientation) {
    return orientation === 'landscape' || orientation === 'portrait';
}

function isValidScan(scan) {
    return scan === 'progressive' || scan === 'interlace';
}

function isValidResolution(resolution) {
    var re = /(?:\+|-)?(?:\d+|\d*\.\d+)(?:e\d+)?(?:dpi|dpcm|dppx)$/;
    return !!resolution.match(re);
}

function isValidValue(value) {
  return value != null && typeof value !== 'boolean' && value !== '';
}

var _mediaFeatureValidator = {
    'width': isValidLength,
    'min-width': isValidLength,
    'max-width': isValidLength,
    'height': isValidLength,
    'min-height': isValidLength,
    'max-height': isValidLength,
    'device-width': isValidLength,
    'min-device-width': isValidLength,
    'max-device-width': isValidLength,
    'device-height': isValidLength,
    'min-device-height': isValidLength,
    'max-device-height': isValidLength,
    'aspect-ratio': isValidRatio,
    'min-aspect-ratio': isValidRatio,
    'max-aspect-ratio': isValidRatio,
    'device-aspect-ratio': isValidRatio,
    'min-device-aspect-ratio': isValidRatio,
    'max-device-aspect-ratio': isValidRatio,
    'color': isValidValue,
    'min-color': isValidValue,
    'max-color': isValidValue,
    'color-index': isValidInteger,
    'min-color-index': isValidInteger,
    'max-color-index': isValidInteger,
    'monochrome': isValidInteger,
    'min-monochrome': isValidInteger,
    'max-monochrome': isValidInteger,
    'resolution': isValidResolution,
    'min-resolution': isValidResolution,
    'max-resolution': isValidResolution,
    'scan': isValidScan,
    'grid': isValidInteger,
    'orientation': isValidOrientation
};

var _validMediaFeatures = {
    'width': true,
    'min-width': true,
    'max-width': true,
    'height': true,
    'min-height': true,
    'max-height': true,
    'device-width': true,
    'min-device-width': true,
    'max-device-width': true,
    'device-height': true,
    'min-device-height': true,
    'max-device-height': true,
    'aspect-ratio': true,
    'min-aspect-ratio': true,
    'max-aspect-ratio': true,
    'device-aspect-ratio': true,
    'min-device-aspect-ratio': true,
    'max-device-aspect-ratio': true,
    'color': true,
    'min-color': true,
    'max-color': true,
    'color-index': true,
    'min-color-index': true,
    'max-color-index': true,
    'monochrome': true,
    'min-monochrome': true,
    'max-monochrome': true,
    'resolution': true,
    'min-resolution': true,
    'max-resolution': true,
    'scan': true,
    'grid': true,
    'orientation': true
};

var _validMediaTypes = {
    'all': true,
    'aural': true,
    'braille': true,
    'handheld': true,
    'print': true,
    'projection': true,
    'screen': true,
    'tty': true,
    'tv': true,
    'embossed': true
};

var _validQualifiers = {
    'not': true,
    'only': true
};

function isValidFeature(feature) {
    return !!_validMediaFeatures[feature];
}

function isValidQualifier(qualifier) {
    return !!_validQualifiers[qualifier];
}

function isValidMediaType(mediaType) {
    return !!_validMediaTypes[mediaType];
}

function isValidQualifiedMediaType(mediaType) {
    var terms = mediaType.trim().split(/\s+/);
    switch (terms.length) {
        case 1:
            return isValidMediaType(terms[0]);
        case 2:
            return isValidQualifier(terms[0]) && isValidMediaType(terms[1]);
        default:
            return false;
    }
}

function isValidExpression(expression) {
    if (expression.length < 2) {
        return false;
    }

    // Parentheses are required around expressions
    if (expression[0] !== '(' || expression[expression.length - 1] !== ')') {
        return false;
    }

    // Remove parentheses and spacess
    expression = expression.substring(1, expression.length - 1);

    // Is there a value to accompany the media feature?
    var featureAndValue = expression.split(/\s*:\s*/);
    switch (featureAndValue.length) {
        case 1:
            var feature = featureAndValue[0].trim();
            return isValidFeature(feature);
        case 2:
            var feature = featureAndValue[0].trim();
            var value = featureAndValue[1].trim();
            return isValidFeature(feature) &&
                   _mediaFeatureValidator[feature](value);
        default:
            return false;
    }
}

function isValidMediaQuery(query) {
    var andSplitter = /\s+and\s+/;
    var queryTerms = query.split(andSplitter);
    return (isValidQualifiedMediaType(queryTerms[0]) ||
        isValidExpression(queryTerms[0])) &&
        queryTerms.slice(1).every(isValidExpression);
}

function isValidMediaQueryList(mediaQuery) {
    mediaQuery = mediaQuery.toLowerCase();

    if (mediaQuery.substring(0, 6) !== '@media') {
        return false;
    }

    var commaSplitter = /\s*,\s*/;
    var queryList = mediaQuery.substring(7, mediaQuery.length)
                              .split(commaSplitter);
    return queryList.every(isValidMediaQuery);
}

module.exports = isValidMediaQueryList
