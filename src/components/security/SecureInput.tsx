
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { validateInput, sanitizeHTML, ValidationRules } from '@/utils/security';

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  validationType: keyof typeof ValidationRules;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const SecureInput: React.FC<SecureInputProps> = ({
  value,
  onChange,
  placeholder,
  validationType,
  required = false,
  className,
  disabled = false
}) => {
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const sanitizedValue = sanitizeHTML(newValue);
    
    // Validate input
    const validation = validateInput(sanitizedValue, ValidationRules[validationType]);
    
    if (!validation.isValid && validation.error) {
      setError(validation.error);
    } else {
      setError('');
    }
    
    onChange(sanitizedValue);
  };

  return (
    <div>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={`${className} ${error ? 'border-red-500' : ''}`}
        disabled={disabled}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default SecureInput;
