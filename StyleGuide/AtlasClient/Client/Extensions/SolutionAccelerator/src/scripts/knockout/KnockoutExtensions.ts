/* Validation extender */

interface KnockoutExtenders {
    validator?: (target: any, validationFunc: (value: any) => boolean) => any;
}

interface KnockoutObservable<T> {
    isValid?: KnockoutObservable<boolean>;
}

ko.extenders.validator = (target: any, validationFunc: (value: any) => boolean) => {
    // Add an isValid property
    target.isValid = ko.observable();

    // Create a local validation function to modify the isValid property
    function validate(newValue: any) {
        target.isValid(validationFunc(newValue));
    }

    // Validate the initial value
    validate(target());

    // Subscribe to validate future values
    target.subscribe(validate)
};