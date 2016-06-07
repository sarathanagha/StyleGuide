import Util = require("Util");
import ResourceParameterDescriptor = require("../Model/ResourceProperty");

export interface IValidator {
    /**
     * Validates a value as correct or incorrect according to some rules
     * @param {string} val the value to evaluate
     * @return {string} null if no error or a string containing the error message if invalid
     **/
    validate(val: string): string;
}

export class PropertyMinValidator implements IValidator {
    private min: number;
    /**
     * @constructor
     * Validates that a value is greater than or equal to a minimum value.
     * @param {number} min the minimum value a valid value can be.
     **/
    constructor(min: number) {
        this.min = min;
    }

    /**
     * Verifies that value is >= the minimum the validator allows.
     * @param {string} value the value to evaluate
     * @return {string} the error message if value is NaN or less than the minimum or null if
     *                  the value is valid
     * @see IPropertyValidator
     **/
    public validate(value: string): string {
        if (!value) {
            return "Value is null";
        }

        if (isNaN(parseFloat(value))) {
            return Util.format("Value is {0} not a valid number", value, this.min.toString());
        }

        var valueAsNumber: number = parseFloat(value);

        return this.min <= valueAsNumber ?
            null :
            Util.format("The value {0} is less than minimum of {1}.", value, this.min.toString());
    }
}

export class PropertyMaxValidator implements IValidator {
    private max: number;

    /**
     * @constructor
     * Validates that a value is less than or equal to a maximum value.
     * @param {number} max the maximum value a valid value can be.
     **/
    constructor(max: number) {
        this.max = max;
    }

    /**
     * Verifies that value is <= the maximum the validator allows.
     * @param {string} value the value to evaluate
     * @return {string} the error message if value is NaN or greater than the maximum or null if
     *                  the value is valid
     * @see IPropertyValidator
     **/
    public validate(value: string): string {
        if (!value) {
            return null;
        }

        if (isNaN(parseFloat(value))) {
            return Util.format("The value {0} is not a valid number less than {1}.", value, this.max.toString());
        }

        var valueAsNumber: number = parseFloat(value);

        return this.max >= valueAsNumber ?
            null :
            Util.format("The value {0} is greater than maximum of {1}.", value, this.max.toString());
    }
}

export class RequiredValueValidator implements IValidator {
    /**
     * Verifies a value is given.
     * @param {string} value the value to ensure is provided
     * @return {string} "Value required." if the value is missing or null otherwise.
     * @see IPropertyValidator
     **/
    public validate(value: string): string {
        return value ?
            null :
            "Value required.";
    }
}

export class IntegerValidator implements IValidator {
    /**
     * Verifies whether a given value is a valid integer (i.e. optional + or -, digits only).
     * @param {string} value the string to validate
     * @return {string} the error message if the value is not an integer, or null if valid.
     **/
    public validate(value: string): string {
        var integer: RegExp = /^(^[-+]?[0-9]+)?$/;
        return integer.test(value) ?
            null :
            "The value is not a valid integer.";
    }
}

export class FloatValidator implements IValidator {
    /**
     * Verifies whether a given value is a valid floating point number.
     * @param {string} value the string to validate
     * @return {string} the error message if the value is not a float, or null if valid.
     **/
    public validate(value: string): string {
        // Number(value) returns NaN if value is not a valid float.
        // We explicitly check for "NaN" because we want to accept NaN as a valid float.
        return (value !== "NaN" && isNaN(Number(value))) ?
            "The value is not a valid floating point number." :
            null;
    }
}