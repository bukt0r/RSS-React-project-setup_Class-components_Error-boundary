import { Component } from 'react';
import './ErrorBanner.css';

interface ErrorBannerProps {
  message: string | null;
}

class ErrorBanner extends Component<ErrorBannerProps> {
  render() {
    if (!this.props.message) {
      return null;
    }

    return (
      <p className="error-banner" role="alert">
        {this.props.message}
      </p>
    );
  }
}

export default ErrorBanner;
