import React, { useState } from "react";
import { useForm } from "react-hook-form";
import NumericInput from "./NumericInput"; // Ensure this points to your NumericInput component
import Modal from "../Modal/Modal"; // Import the modal component
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

interface SeasonalPayment {
  month: number;
  amount: string;
}

interface FormValues {
  seasonalPayment: SeasonalPayment[];
}

interface MonthRateTableProps {
  maximumSelectionAllowed: number;
  minimumSeasonalPaymentAmount: number;
  isModal?: boolean; // New prop to decide if it is a modal
  onClose?: () => void; // Function to close the modal (optional)
}

const MonthRateTable: React.FC<MonthRateTableProps> = ({
  maximumSelectionAllowed,
  minimumSeasonalPaymentAmount,
  isModal = true,
  onClose,
}) => {
  const { control, watch, setValue, setError, clearErrors } =
    useForm<FormValues>({
      defaultValues: {
        seasonalPayment: months.map((_, index) => ({
          month: index,
          amount: "",
        })),
      },
    });

  const [checkedMonths, setCheckedMonths] = useState<boolean[]>(
    Array(months.length).fill(false)
  );

  const handleCheckboxChange = (index: number) => {
    const updatedCheckedMonths = [...checkedMonths];
    updatedCheckedMonths[index] = !updatedCheckedMonths[index];
    setCheckedMonths(updatedCheckedMonths);

    if (!updatedCheckedMonths[index]) {
      setValue(`seasonalPayment.${index}.amount`, "");
    }
  };

  const handleAmountChange = (
    index: number,
    values: { floatValue?: number; value: string }
  ) => {
    const amount = values.floatValue !== undefined ? values.floatValue : 0;
    setValue(`seasonalPayment.${index}.amount`, values.value);

    if (amount < minimumSeasonalPaymentAmount) {
      setError(`seasonalPayment.${index}.amount`, {
        type: "manual",
        message: `Amount must be at least ${minimumSeasonalPaymentAmount}.`,
      });
    } else {
      clearErrors(`seasonalPayment.${index}.amount`);
    }
  };

  const watchAllFields = watch();

  return (
    <Modal isOpen={isModal} onClose={onClose}>
      <div className="table-container">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3 style={{ margin: "0", paddingBottom: "10px", textAlign: "right" }}>
          Monthly Amount Table
        </h3>
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
              {months.map((month, index) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedMonths[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td>
                    <NumericInput
                      control={control}
                      name={`seasonalPayment.${index}.amount`}
                      disabled={!checkedMonths[index]}
                      onValueChange={(values) =>
                        handleAmountChange(index, values)
                      }
                    />
                    {watchAllFields.seasonalPayment[index]?.amount &&
                      parseFloat(
                        watchAllFields.seasonalPayment[index].amount.replace(
                          /,/g,
                          ""
                        )
                      ) < minimumSeasonalPaymentAmount && (
                        <p className="error-message">
                          Amount must be at least {minimumSeasonalPaymentAmount}
                          .
                        </p>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {checkedMonths.filter(Boolean).length > maximumSelectionAllowed && (
              <p className="error-message">
                You can select a maximum of {maximumSelectionAllowed} months.
              </p>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MonthRateTable;
