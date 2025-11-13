import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css"
import { useMemo } from "react"
import { useBudget } from "../hooks/useBudget"
import AmountDisplay from "./AmountDisplay"


const BudgetTracker = () => {

    const { state, dispatch } = useBudget()

    const { totalExpenses, totalIncomes } = useMemo(() => {
        return state.expenses.reduce(
            (acc, expense) => {
                const amount = parseFloat(String(expense.amount).replace(',', '.'))
                if(isNaN(amount)) return acc

                if (expense.type === '2') {
                acc.totalIncomes += expense.amount // ingreso ➕
                } else {
                acc.totalExpenses += expense.amount // gasto ➖
                }
                return acc
            },
            { totalExpenses: 0, totalIncomes: 0 }
        )
    }, [state.expenses])

    const restBudget = state.budget - totalExpenses + totalIncomes
    const percentage = state.budget > 0 ? +( (totalExpenses / state.budget)  * 100 ).toFixed(1) : 0
    const colorPercentage = percentage <= 50 ? '#00b760' : percentage <= 75 ? '#fcd856' : '#e5053a' //Verde, Amarillo y Rojo

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar
                    value={percentage}
                    styles={buildStyles({
                        pathColor: colorPercentage,
                        trailColor: '#F5F5F5',
                        textColor: colorPercentage
                    })}
                    text={`${percentage}%`}
                />
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
                <button
                    type="button"
                    className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg cursor-pointer"
                    onClick={() => dispatch({ type: 'restart-app'})}
                >
                    Resetear App
                </button>

                <AmountDisplay
                    label="Disponible"
                    amount={restBudget}
                />

                <AmountDisplay
                    label="Ingresado"
                    amount={totalIncomes}
                />

                <AmountDisplay
                    label="Gastado"
                    amount={totalExpenses}
                />

            </div>
        </div>
    )
}

export default BudgetTracker
