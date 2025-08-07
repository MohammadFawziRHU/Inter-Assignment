import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  return (
    <>
      <Sidebar />
      <div
        style={{
          marginLeft: "250px",
          background: "inherit", 
          color: "inherit",
          minHeight: "100vh",
        }}
      >
        <MainContent />
      </div>
    </>
  );
}

export default App;
