import { useEffect, useState, type ChangeEvent } from "react"
import DatePicker from "react-date-picker"
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import { categories, types } from "../data/categories"
import type { Value } from "../types"
import ErrorMessage from "./ErrorMessage"
import { useBudget } from "../hooks/useBudget"

type FormExpense = {
    type: string
    expenseName: string
    amount: string       // siempre string en el formulario
    category: string
    date: Value
}

const ExpenseForm = () => {

    const [ expense, setExpense ] = useState<FormExpense>({
        type: "1",
        expenseName: '',
        amount: '',
        category: '',
        date: new Date()
    })
    const [ error, setError ] = useState('')

    const { state, dispatch } = useBudget()

    useEffect(() => {
      if(state.editingId) {
        const editingExpense = state.expenses.find( currentExpense => currentExpense.id === state.editingId )
        if(editingExpense) {
            setExpense({
                type: editingExpense.type,
                expenseName: editingExpense.expenseName,
                amount: String(editingExpense.amount),
                category: editingExpense.category || '',
                date: editingExpense.date
            })
        }
      }
    }, [state.editingId, state.expenses])
    

    const handleChange = (e : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target
        
        setExpense(prev => ({
        ...prev,
        [name]: name === 'amount'
            ? (/^[0-9]*[.,]?[0-9]*$/.test(value) ? value : prev.amount)
            : value
        }))
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e : ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Determinar campos a validar según el tipo
        const isIncome = expense.type === '2'
        const requiredFields = isIncome
            ? [ 'type', 'expenseName', 'amount', 'date' ]
            : [ 'type', 'expenseName', 'amount', 'category', 'date' ]

        // Validar si algún campo está vacío, 0 o null
        const invlid = requiredFields.some( field => {
            const value = expense[ field as keyof FormExpense]
            return value === '' || value === null || value === undefined
        })

        if(invlid) {
            setError('Todos los campos son obligatorios')
            return
        }

        const amountNum = parseFloat(expense.amount.replace(',', '.'))
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('La cantidad no es válida.')
            return
        }

        setError('')

        const expenseWithIcon = {
            ...expense,
            amount: amountNum,
            icon: isIncome ? 'ingreso' : categories.find(cat => cat.id === expense.category)?.icon
        }

        // Agregar o Actualizar un Expense
        if(state.editingId) {
            dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expenseWithIcon } } })
        } else {
            dispatch({ type: 'add-expense', payload: { expense: expenseWithIcon } })
        }

        // Reiniciar el State
        setExpense({
            type: "1",
            expenseName: '',
            amount: '',
            category: '',
            date: new Date()
        })
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">{state.editingId ? 'Modificar' : 'Nuevo'}</legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="type"
                    className="text-xl"
                >Tipo:</label>
                <select
                    id="type"
                    className="bg-slate-100 p-2"
                    name="type"
                    onChange={handleChange}
                    value={expense.type}
                >
                    {types.map( type => (
                        <option
                            key={type.id}
                            value={type.id}
                        >{type.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="expenseName"
                    className="text-xl"
                >Nombre Gasto:</label>
                <input 
                    type="text"
                    id="expenseName"
                    placeholder="Añade el Nombre del Gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    onChange={handleChange}
                    value={expense.expenseName}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="amount"
                    className="text-xl"
                >Cantidad:</label>
                <input 
                    type="text"
                    inputMode="decimal"
                    id="amount"
                    placeholder="Añade la Cantidad del Gasto"
                    className="bg-slate-100 p-2"
                    name="amount"
                    onChange={handleChange}
                    value={expense.amount}
                />
            </div>

            {expense.type !== "2" && (
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="category"
                        className="text-xl"
                    >
                        Categoría:
                    </label>
                    <select
                        id="category"
                        className="bg-slate-100 p-2"
                        name="category"
                        onChange={handleChange}
                        value={expense.category}
                    >
                        <option value="">-- Seleccione --</option>
                        {categories.map( category => (
                            <option
                                key={category.id}
                                value={category.id}
                            >{category.name}</option>
                        ))}
                    </select>
                </div>
            )}
            

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="amount"
                    className="text-xl"
                >Fecha Gasto:</label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleChangeDate}
                />
            </div>

            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId ? 'Actualizar' : 'Registrar'}
            />

        </form>
    )
}

export default ExpenseForm
