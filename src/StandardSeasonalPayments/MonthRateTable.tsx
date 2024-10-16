import React from "react";
import { useForm, Controller } from "react-hook-form";
import NumericInput from "./NumericInput"; // Ensure this points to your NumericInput component
import "./MonthRateTable.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface FormValues {
  [key: string]: {
    checked: boolean;
    amount: string;
  };
}

interface MonthRateTableProps {
  maximumSelectionAllowed: number;
  minimumSeasonalPaymentAmount: number;
}

const MonthRateTable: React.FC<MonthRateTableProps> = ({
  maximumSelectionAllowed,
  minimumSeasonalPaymentAmount,
}) => {
  const { control, watch, setValue, setError, clearErrors } =
    useForm<FormValues>({
      defaultValues: months.reduce((acc, month) => {
        acc[month] = { checked: false, amount: "" };
        return acc;
      }, {} as FormValues),
    });

  const watchAllFields = watch();
  console.log({ watchAllFields });
  const handleCheckboxChange = (month: string, isChecked: boolean) => {
    setValue(`${month}.checked`, isChecked);
    if (!isChecked) {
      setValue(`${month}.amount`, ""); // Reset amount if unchecked
    }
  };

  const handleAmountChange = (month: string, values: any) => {
    const amount = values.floatValue !== undefined ? values.floatValue : 0; // Default to 0 if undefined
    setValue(`${month}.amount`, values.value); // Update the input value

    if (amount < minimumSeasonalPaymentAmount) {
      setError(`${month}.amount`, {
        type: "manual",
        message: `Amount must be at least ${minimumSeasonalPaymentAmount}.`,
      });
    } else {
      clearErrors(`${month}.amount`);
    }
  };

  const getSelectedMonthsCount = () => {
    return months.filter((month) => watchAllFields[month].checked).length;
  };

  return (
    <div className="table-container">
      <form>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month) => (
              <tr key={month}>
                <td>{month}</td>
                <td>
                  <Controller
                    name={`${month}.checked`}
                    control={control}
                    render={({ field: { value } }) => (
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleCheckboxChange(month, e.target.checked)
                        }
                      />
                    )}
                  />
                </td>
                <td>
                  <NumericInput
                    control={control}
                    name={`${month}.amount`}
                    disabled={!watchAllFields[month].checked}
                    onValueChange={(values) =>
                      handleAmountChange(month, values)
                    } // Pass the values
                  />
                  {watchAllFields[month].amount &&
                    parseFloat(watchAllFields[month].amount.replace(/,/g, "")) <
                      minimumSeasonalPaymentAmount && (
                      <p style={{ color: "red" }}>
                        Amount must be at least {minimumSeasonalPaymentAmount}.
                      </p>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {getSelectedMonthsCount() > maximumSelectionAllowed && (
            <p style={{ color: "red" }}>
              You can select a maximum of {maximumSelectionAllowed} months.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default MonthRateTable;
