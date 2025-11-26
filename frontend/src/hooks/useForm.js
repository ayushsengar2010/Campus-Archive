import { useState, useCallback } from 'react';
import { validateField, validateForm, hasErrors, trimObjectStrings } from '../utils/validation';

/**
 * Custom hook for form management with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Validation schema
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationSchema = {}, onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  /**
   * Handle input change
   * @param {Event|Object} e - Event or { name, value } object
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target || e;
    
    let finalValue = value;
    
    // Handle different input types
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'file') {
      finalValue = files && files.length > 0 ? files[0] : null;
    } else if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }
    
    setValues(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle input blur
   * @param {Event|string} e - Event or field name
   */
  const handleBlur = useCallback((e) => {
    const fieldName = typeof e === 'string' ? e : e.target.name;
    
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate field on blur
    if (validationSchema[fieldName]) {
      const error = validateField(values[fieldName], validationSchema[fieldName]);
      
      if (error) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error,
        }));
      }
    }
  }, [values, validationSchema]);

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    setSubmitCount(prev => prev + 1);
    
    // Trim string values
    const trimmedValues = trimObjectStrings(values);
    setValues(trimmedValues);

    // Validate all fields
    const formErrors = validateForm(trimmedValues, validationSchema);
    setErrors(formErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // If there are errors, don't submit
    if (hasErrors(formErrors)) {
      return;
    }

    // Submit form
    setIsSubmitting(true);
    
    try {
      await onSubmit(trimmedValues);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // If error is an object with field-specific errors, set them
      if (error.errors && typeof error.errors === 'object') {
        setErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, onSubmit]);

  /**
   * Set a specific field value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Set a specific field error
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Set multiple values at once
   * @param {Object} newValues - New values object
   */
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  /**
   * Reset a specific field
   * @param {string} name - Field name
   */
  const resetField = useCallback((name) => {
    setValues(prev => ({
      ...prev,
      [name]: initialValues[name],
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setTouched(prev => ({
      ...prev,
      [name]: false,
    }));
  }, [initialValues]);

  /**
   * Validate a specific field manually
   * @param {string} name - Field name
   * @returns {string|null} Error message or null
   */
  const validateFieldManually = useCallback((name) => {
    if (!validationSchema[name]) return null;
    
    const error = validateField(values[name], validationSchema[name]);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    return error;
  }, [values, validationSchema]);

  /**
   * Validate entire form manually
   * @returns {boolean} True if form is valid
   */
  const validateFormManually = useCallback(() => {
    const formErrors = validateForm(values, validationSchema);
    setErrors(formErrors);
    return !hasErrors(formErrors);
  }, [values, validationSchema]);

  /**
   * Get field props for input elements
   * @param {string} name - Field name
   * @param {string} type - Input type
   * @returns {Object} Field props
   */
  const getFieldProps = useCallback((name, type = 'text') => {
    const props = {
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
    };

    if (type === 'checkbox') {
      props.checked = values[name] || false;
      delete props.value;
    } else if (type === 'file') {
      delete props.value;
    }

    return props;
  }, [values, handleChange, handleBlur]);

  /**
   * Get error props for error display
   * @param {string} name - Field name
   * @returns {Object} Error props
   */
  const getErrorProps = useCallback((name) => {
    return {
      error: touched[name] && errors[name],
      hasError: touched[name] && !!errors[name],
    };
  }, [errors, touched]);

  return {
    // Values
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Setters
    setFieldValue,
    setFieldError,
    setFormValues,

    // Validation
    validateField: validateFieldManually,
    validateForm: validateFormManually,

    // Reset
    resetForm,
    resetField,

    // Helper methods
    getFieldProps,
    getErrorProps,

    // Computed
    isValid: !hasErrors(errors),
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
};

export default useForm;
