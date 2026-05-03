import { Component, type ChangeEvent } from 'react';
import CardList from './components/CardList';
import type { SearchResultItem } from './types/item';
import './App.css';

const SEARCH_STORAGE_KEY = 'searchQuery';

const PLACEHOLDER_RESULTS: SearchResultItem[] = [
  {
    name: 'Sample item A',
    description:
      'Short sample description so the results list shows name and body text together.',
  },
  {
    name: 'Sample item B',
    description:
      'Another line of sample text to check spacing, alignment, and readability in the list.',
  },
];

interface AppState {
  searchInput: string;
  results: SearchResultItem[];
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    searchInput: '',
    results: PLACEHOLDER_RESULTS,
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
          <CardList items={this.state.results} />
        </section>
      </main>
    );
  }
}

export default App;
