import { useEffect } from "react";
function App() {
  useEffect(() => {
    document.title = "The Wedding";
  }, []);
  return (
    <div className="h-full min-h-full">
      <div className="hero min-h-full h-full pt-[20%]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Your Awesome Website!</h1>
            <p className="py-6">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industrys standard dummy text
              ever since the 1500s.
            </p>
            <button className="btn btn-primary">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
