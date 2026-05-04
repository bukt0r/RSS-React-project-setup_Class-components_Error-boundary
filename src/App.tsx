import { Component, type ChangeEvent } from 'react';
import CardList from './components/CardList';
import ErrorBanner from './components/ErrorBanner';
import ErrorSpike from './components/ErrorSpike';
import LoadingSpinner from './components/LoadingSpinner';
import { readStoredSearchRaw, writeStoredSearchTrimmed } from './services/searchStorage';
import { fetchFirstPagePeople, SwapiHttpError } from './services/swapiPeople';
import type { SearchResultItem } from './types/item';
import './App.css';

interface AppState {
  searchInput: string;
  results: SearchResultItem[];
  isLoading: boolean;
  fetchError: string | null;
  simulateCrash: boolean;
}

class App extends Component<Record<string, never>, AppState> {
  private isUnmounted = false;

  private lastFetchedTrimmedQuery: string | null = null;

  state: AppState = {
    searchInput: '',
    results: [],
    isLoading: false,
    fetchError: null,
    simulateCrash: false,
  };

  componentDidMount(): void {
    const savedQuery = readStoredSearchRaw();
    const searchInput = savedQuery ?? '';

    this.setState({ searchInput });
    void this.loadInitialPage(searchInput);
  }

  componentWillUnmount(): void {
    this.isUnmounted = true;
  }

  loadInitialPage = async (searchInputForRequest: string): Promise<void> => {
    const trimmed = searchInputForRequest.trim();

    if (!this.isUnmounted) {
      this.setState({ isLoading: true, fetchError: null });
    }

    try {
      const items = await fetchFirstPagePeople(searchInputForRequest);
      if (this.isUnmounted) return;
      this.lastFetchedTrimmedQuery = trimmed;
      this.setState({ results: items, fetchError: null });
    } catch (error: unknown) {
      if (this.isUnmounted) return;
      const fetchError =
        error instanceof SwapiHttpError
          ? error.message
          : 'Unable to load data. Please try again.';
      this.setState({ results: [], fetchError });
    } finally {
      if (!this.isUnmounted) {
        this.setState({ isLoading: false });
      }
    }
  };

  handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchInput: event.target.value });
  };

  handleSearchClick = (): void => {
    const trimmed = this.state.searchInput.trim();

    if (trimmed === this.lastFetchedTrimmedQuery) {
      return;
    }

    void this.submitSearch(trimmed);
  };

  handleTestErrorClick = (): void => {
    this.setState({ simulateCrash: true });
  };

  submitSearch = async (trimmed: string): Promise<void> => {
    if (!this.isUnmounted) {
      this.setState({ isLoading: true, fetchError: null });
    }

    try {
      const items = await fetchFirstPagePeople(trimmed);
      if (this.isUnmounted) return;
      this.lastFetchedTrimmedQuery = trimmed;
      writeStoredSearchTrimmed(trimmed);
      this.setState({ results: items, searchInput: trimmed, fetchError: null });
    } catch (error: unknown) {
      if (this.isUnmounted) return;
      const fetchError =
        error instanceof SwapiHttpError
          ? error.message
          : 'Unable to load data. Please try again.';
      this.setState({ results: [], fetchError });
    } finally {
      if (!this.isUnmounted) {
        this.setState({ isLoading: false });
      }
    }
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
              disabled={this.state.isLoading}
            />
            <button
              type="button"
              onClick={this.handleSearchClick}
              disabled={this.state.isLoading}
            >
              Search
            </button>
          </div>
        </section>

        <section className="results-section" aria-label="Results section">
          <h2>Results</h2>
          <ErrorBanner message={this.state.fetchError} />
          <div className="results-section__panel">
            {this.state.isLoading ? (
              <div
                className="results-section__overlay"
                aria-busy="true"
                aria-label="Loading results"
              >
                <LoadingSpinner label="Loading results" />
              </div>
            ) : null}
            <div className="results-section__body">
              <CardList items={this.state.results} />
            </div>
          </div>
        </section>

        <div className="app-test-error">
          <button type="button" onClick={this.handleTestErrorClick}>
            Test error
          </button>
        </div>

        {this.state.simulateCrash ? <ErrorSpike /> : null}
      </main>
    );
  }
}

export default App;
