import React from "react";

function BankAccountList({ data, theme }) {
  return (
    <>
      {data.map((item, key) => (
        <div
          key={key}
          data-aos="fade-up"
          className={
            "w-[75%] h-auto md:w-96 md:h-56 rounded-xl shadow-xl p-6 relative mx-2 mb-4 " +
            (theme == "dark"
              ? "text-white bg-gray-700"
              : "text-gray-900 bg-white")
          }
        >
          <div className="text-sm">
            Bank <span className="capitalize">{item.bank}</span>
          </div>
          <div className="mt-4 md:mt-8 text-lg md:text-2xl tracking-widest font-semibold">
            {item.number}
          </div>
          <div className="mt-2 md:mt-4 flex justify-between items-center">
            <div>
              <div className="text-xs">Card Holder</div>
              <div className="text-sm font-medium capitalize">{item.name}</div>
            </div>
            <div>
              <div className="text-xs">
                <button
                  className="btn btn-outline btn-xs"
                  onClick={() => copyContent(item.number)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h3 w-3"
                  >
                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                    <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                  </svg>
                  Salin
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default BankAccountList;
