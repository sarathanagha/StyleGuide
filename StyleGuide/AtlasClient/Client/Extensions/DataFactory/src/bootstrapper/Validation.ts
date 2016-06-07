export interface IValidationResult {
    valid: boolean;
    message: string;
}

export interface IValidatable {
    isValid: () => Q.Promise<IValidationResult>;
    valid: KnockoutObservableBase<boolean>;
    dispose?: () => void;
}

export function isNumber(input: number): Q.Promise<IValidationResult> {
    if (input && isNaN(input)) {
        return Q({
            valid: false,
            message: "Value is not a number"
        });
    }
    return Q({
        valid: true,
        message: ""
    });

}
