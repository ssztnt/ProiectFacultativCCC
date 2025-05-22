package mpp.clearncleancity.model.validators;

public interface IValidatorFactory {
    Validator createValidator(ValidatorStrategy validatorStrategy);
}
