import { Component, type ChangeEvent } from 'react';
import './App.css';

const SEARCH_STORAGE_KEY = 'searchQuery';

interface AppState {
  searchInput: string;
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    searchInput: '',
  };

  componentDidMount(): void {
    const savedQuery = localStorage.getItem(SEARCH_STORAGE_KEY);

    if (savedQuery !== null) {
      this.setState({ searchInput: savedQuery });
    }
  }

  handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchInput: event.target.value });
  };

  render() {
    return (
      <main className="app-layout">
        <section className="search-section" aria-label="Search section">
          <h1>Item Search</h1>
          <div className="search-controls">
            <input
              type="text"
              placeholder="Enter item name"
              value={this.state.searchInput}
              onChange={this.handleSearchInputChange}
            />
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
