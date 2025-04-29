import express from "express";
import { Employee } from './data-source.js';
import {Op} from "sequelize";


const router = express.Router()

router.get('/', async (req, res) => {
    const { search = '', sortBy = '', order = 'ASC' } = req.query;

    try {
        let query = {
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { surname: { [Op.iLike]: `%${search}%` } },
                    { position: { [Op.iLike]: `%${search}%` } },
                ],
            },
        };

        if (sortBy) {
            query.order = [[sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
        }

        const employees = await Employee.findAll(query);
        res.json(employees);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Database error');
    }
})

router.post('/', async (req, res) => {
    const { name, surname, age, position, hireDate, hours, rate } = req.body;

    try {
        const employee = await Employee.create({
            name,
            surname,
            age,
            position,
            hireDate,
            hours,
            rate,
            salary: hours * rate,
        });

        res.status(201).json(employee);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Database error');
    }
})

router.put('/:id', async (req, res) => {
    const { hours, rate } = req.body;
    const id = +req.params.id;

    try {
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).send('Not found');
        }

        employee.hours = hours;
        employee.rate = rate;
        employee.salary = hours * rate;

        await employee.save();

        res.json(employee);
    } catch (err) {
        console.error('Error updating employee', err);
        res.status(500).send('Database error');
    }
})

export default router