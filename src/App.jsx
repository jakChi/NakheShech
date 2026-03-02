import "./App.css";
import Gallery from "./components/Gallery";
import LoginGate from "./components/LoginGate";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <LoginGate>
      <div className="appContainer">
        <header className="appHeader">
          <h1> What's New?</h1>
        </header>
        <div className="appDivider" />
        <main className="dashboard">
          <UploadForm />
          <div className="galleryContainer">
            <Gallery />
          </div>
        </main>
      </div>
    </LoginGate>
  );
}

export default App;
