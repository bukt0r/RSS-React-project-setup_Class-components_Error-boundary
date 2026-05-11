import { Component, type ReactNode } from 'react';

class ErrorSpike extends Component {
  render(): ReactNode {
    throw new Error('Simulated app error (error boundary test)');
    return null;
  }
}

export default ErrorSpike;
