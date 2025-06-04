
import React from 'react';
import { sanitizeHTML } from '@/utils/security';

interface SafeContentProps {
  content: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const SafeContent: React.FC<SafeContentProps> = ({ 
  content, 
  className = '', 
  as: Component = 'div' 
}) => {
  const sanitizedContent = sanitizeHTML(content);
  
  return (
    <Component className={className}>
      {sanitizedContent}
    </Component>
  );
};

export default SafeContent;
