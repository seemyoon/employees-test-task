import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

const API = "/api/employees";
const LIMIT = 5;

export default function App() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const {register, handleSubmit, reset} = useForm();

    const fetchEmployees = async () => {
        let [sortBy, order] = sort.includes(":") ? sort.split(":") : ["", ""];
        const res = await fetch(`${API}?search=${search}&sortBy=${sortBy}&order=${order}`);
        const data = await res.json();
        setEmployees(data);
        setCurrentPage(1);
    };

    const handleEdit = async (id, field, value) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === id
                    ? {
                        ...emp,
                        [field]: value,
                        salary:
                            field === "hours"
                                ? value * emp.rate
                                : emp.hours * value,
                    }
                    : emp
            )
        );

        const updated = employees.find((emp) => emp.id === id);
        const updatedData = {
            ...updated,
            [field]: value,
            salary:
                field === "hours"
                    ? value * updated.rate
                    : updated.hours * value,
        };

        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });
    };

    const onSubmit = async (form) => {
        await fetch(API, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...form, age: +form.age, hours: +form.hours, rate: +form.rate}),
        });
        reset();
        await fetchEmployees();
    };

    const totalPages = Math.round(employees.length / LIMIT);
    const currentEmployees = employees.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

    useEffect(async () => {
        await fetchEmployees();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Employees</h1>
            <div className="controls">
                <input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">no sort</option>
                    <option value="age:asc">age ↑</option>
                    <option value="age:desc">age ↓</option>
                    <option value="hireDate:asc">hire date ↑</option>
                    <option value="hireDate:desc">hire date ↓</option>
                </select>
                <button onClick={fetchEmployees}>Load</button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th>name</th>
                    <th>surname</th>
                    <th>age</th>
                    <th>position</th>
                    <th>hire Date</th>
                    <th>hours</th>
                    <th>rate</th>
                    <th>salary</th>
                </tr>
                </thead>
                <tbody>
                {currentEmployees.map((emp) => (
                    <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.surname}</td>
                        <td>{emp.age}</td>
                        <td>{emp.position}</td>
                        <td>{emp.hireDate}</td>
                        <td>
                            <input
                                type="number"
                                value={emp.hours}
                                onChange={(e) => handleEdit(emp.id, "hours", +e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={emp.rate}
                                onChange={(e) => handleEdit(emp.id, "rate", +e.target.value)}
                            />
                        </td>
                        <td>{emp.salary}</td>
                    </tr>
                ))}
                </tbody>

            </table>
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    next
                </button>
            </div>
            <h2 className="subtitle">add new employee</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <input {...register("name")} placeholder="Name" required/>
                <input {...register("surname")} placeholder="Surname" required/>
                <input type="number" {...register("age")} placeholder="Age" required/>
                <input {...register("position")} placeholder="Position" required/>
                <input type="date" {...register("hireDate")} placeholder="Hire Date" required/>
                <input type="number" {...register("hours")} placeholder="Hours" required/>
                <input type="number" {...register("rate")} placeholder="Rate" required/>
                <button type="submit">add</button>
            </form>
        </div>
    );
}
