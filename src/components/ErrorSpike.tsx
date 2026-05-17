function ErrorSpike(): null {
  throw new Error('Simulated app error (error boundary test)');
  return null;
}

export default ErrorSpike;
