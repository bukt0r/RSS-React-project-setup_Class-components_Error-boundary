import { useSearchStorage } from '../hooks/useSearchStorage';
import HomePage from './HomePage';

function HomePageContainer() {
  const { readStoredSearch, saveTrimmedSearch } = useSearchStorage();

  return (
    <HomePage
      readStoredSearch={readStoredSearch}
      saveTrimmedSearch={saveTrimmedSearch}
    />
  );
}

export default HomePageContainer;
