package mpp.clearncleancity.model.validators;

public interface Validator<T> {
    void validate(T entity) throws ValidatorException;
}
