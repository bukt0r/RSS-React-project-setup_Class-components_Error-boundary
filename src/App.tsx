import { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <main className="app-layout">
        <section className="search-section" aria-label="Search section">
          <h1>Item Search</h1>
          <div className="search-controls">
            <input type="text" placeholder="Enter item name" />
            <button type="button">Search</button>
          </div>
        </section>

        <section className="results-section" aria-label="Results section">
          <h2>Results</h2>
          <p>Search results will be displayed here.</p>
        </section>
      </main>
    );
  }
}

export default App;
