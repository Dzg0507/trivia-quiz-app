# Coding Standards

This document outlines the coding standards and best practices for the Trivia Quest Advanced application.

## General Guidelines

- Follow the feature-based architecture
- Use TypeScript for type safety
- Use functional components with hooks
- Keep components small and focused
- Use context for global state management
- Use custom hooks for reusable logic
- Write unit tests for components and hooks

## Imports

Use the following import order:

1. React and React-related imports
2. Third-party libraries
3. Feature imports
4. Shared imports
5. Type imports
6. Style imports

Example:

`	sx
// React and React-related imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Third-party libraries
import { motion } from 'framer-motion';

// Feature imports
import { useQuizFlow } from '../../hooks/useQuizFlow';

// Shared imports
import { Button } from '../../../shared/components/Button';

// Type imports
import { Question, Answer } from '../../../types/quiz';

// Style imports
import './Quiz.css';
`

## Feature Exports

Each feature should export its public API through an index.ts file:

`	sx
// features/quiz/index.ts
export * from './components/Quiz';
export * from './components/QuizPage';
export * from './hooks/useQuizFlow';
export * from './services/triviaApi';
`

## Component Structure

Components should follow this structure:

`	sx
import React from 'react';
import { useUIContext } from '../../../context/UIContext';
import { Button } from '../../../shared/components/Button';
import { ComponentProps } from '../../../types/common';

interface ExampleComponentProps extends ComponentProps {
  title: string;
  onAction: () => void;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  onAction,
  className,
}) => {
  const { loading } = useUIContext();

  const handleClick = () => {
    onAction();
  };

  return (
    <div className={className}>
      <h2>{title}</h2>
      <Button onClick={handleClick} disabled={loading}>
        Click Me
      </Button>
    </div>
  );
};
`

## Hook Structure

Hooks should follow this structure:

`	sx
import { useState, useEffect } from 'react';
import { useUIContext } from '../../../context/UIContext';
import { fetchData } from '../services/dataService';
import { DataItem } from '../../../types/common';

export const useDataFetcher = (id: string) => {
  const [data, setData] = useState<DataItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useUIContext();

  useEffect(() => {
    const fetchDataItem = async () => {
      try {
        setLoading(true);
        const result = await fetchData(id);
        setData(result);
      } catch (err) {
        setError(err.message);
        notify('Error fetching data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDataItem();
  }, [id, notify]);

  return { data, loading, error };
};
`

## Testing

Write tests for components and hooks:

`	sx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  test('renders title', () => {
    render(
      <ExampleComponent
        title="Test Title"
        onAction={jest.fn()}
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('calls onAction when button is clicked', () => {
    const mockOnAction = jest.fn();
    render(
      <ExampleComponent
        title="Test Title"
        onAction={mockOnAction}
      />
    );
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });
});
`
