import { useState } from 'react';
import Modal from './components/Modal/Modal';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="app">
      <h1>React Forms</h1>
      <p>Open the shared modal that will host both form implementations.</p>
      <button type="button" onClick={() => setIsModalOpen(true)}>
        Open modal
      </button>

      <Modal
        isOpen={isModalOpen}
        title="Form modal"
        onClose={() => setIsModalOpen(false)}
      >
        <p>Form content will be added here.</p>
      </Modal>
    </main>
  );
}

export default App;
