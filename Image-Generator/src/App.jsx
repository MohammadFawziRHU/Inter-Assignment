import Sidebar from "./componenets/Sidebar"; 
function App() {
  return (
    <>
      <Sidebar />
      <div
        style={{
          marginLeft: "250px", // matches sidebar width
          background: "#1e1e1e",
          color: "#fff",
          padding: "2rem",
          minHeight: "100vh",
        }}
      >
        <h1>Main Area</h1>
        {/* We'll build the content here next */}
      </div>
    </>
  );
}

export default App;

