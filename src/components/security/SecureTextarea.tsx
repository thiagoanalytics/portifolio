
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { validateInput, sanitizeHTML, ValidationRules } from '@/utils/security';

interface SecureTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  validationType: keyof typeof ValidationRules;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  rows?: number;
}

const SecureTextarea: React.FC<SecureTextareaProps> = ({
  value,
  onChange,
  placeholder,
  validationType,
  required = false,
  className,
  disabled = false,
  rows = 4
}) => {
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={`${className} ${error ? 'border-red-500' : ''}`}
        disabled={disabled}
        rows={rows}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default SecureTextarea;
