package mpp.clearncleancity.model.validators;

public class ValidatorFactory implements IValidatorFactory {
    @Override
    public Validator createValidator(ValidatorStrategy validatorStrategy) {
        switch (validatorStrategy) {
            case USER -> { return new UserValidator(); }
            case PROBA -> { return new IssueValidator(); }
            default -> throw new IllegalArgumentException("Unknown validator strategy: " + validatorStrategy + "!");
        }
    }
}
