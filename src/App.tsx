import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MonthRateTable from "./StandardSeasonalPayments/MonthRateTable";

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Monthly Amount Table</h1>
      <MonthRateTable
        maximumSelectionAllowed={3}
        minimumSeasonalPaymentAmount={100}
      />
    </div>
  );
};

export default App;
