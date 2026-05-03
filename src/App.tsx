import { Component, type ChangeEvent } from 'react';
import CardList from './components/CardList';
import { fetchFirstPagePeople } from './services/swapiPeople';
import type { SearchResultItem } from './types/item';
import './App.css';

const SEARCH_STORAGE_KEY = 'searchQuery';

interface AppState {
  searchInput: string;
  results: SearchResultItem[];
}

class App extends Component<Record<string, never>, AppState> {
  private isUnmounted = false;

  state: AppState = {
    searchInput: '',
    results: [],
  };

  componentDidMount(): void {
    const savedQuery = localStorage.getItem(SEARCH_STORAGE_KEY);
    const searchInput = savedQuery ?? '';

    this.setState({ searchInput });
    void this.loadInitialPage(searchInput);
  }

  componentWillUnmount(): void {
    this.isUnmounted = true;
  }

  loadInitialPage = async (searchInputForRequest: string): Promise<void> => {
    try {
      const items = await fetchFirstPagePeople(searchInputForRequest);
      if (this.isUnmounted) return;
      this.setState({ results: items });
    } catch {
      if (this.isUnmounted) return;
      this.setState({ results: [] });
    }
  };

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
