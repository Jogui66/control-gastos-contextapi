import { useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import { useBudget } from "../hooks/useBudget"

const BudgetForm = () => {

    const [budget, setBudget] = useState<string>('')
    const { dispatch } = useBudget()

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if(val === '' || /^[0-9]*[.,]?[0-9]*$/.test(val)) {
            setBudget(val.replace(',', '.'))
        }
    }

    const isValid = useMemo(() => {
        const num = parseFloat(budget)
        return isNaN(num) || num <= 0
    }, [budget])

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const num = parseFloat(budget)
        if(!isNaN(num) && num > 0) {
            dispatch({ type: 'add-budget', payload: {budget: num}})
        }

    }

    return (
        <form 
            className="space-y-5"
            onSubmit={handleSubmit}    
        >
        <div className="flex flex-col space-y-5">
            <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">Definir Presupuesto</label>
            <input 
                id="budget"
                type="text"
                inputMode="decimal"
                className="w-full bg-white border bordger-gray-200 p-2"
                placeholder="Define tu presupuesto"
                name="budget"
                value={budget}
                onChange={handleChange}
            />
        </div>
        <input 
            type="submit"
            value='Definir Presupuesto'
            className="bg-blue-600 disabled:opacity-40 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase"
            disabled={isValid}
        />
        </form>
    )
}

export default BudgetForm