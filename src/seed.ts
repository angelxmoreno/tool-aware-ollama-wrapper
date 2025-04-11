import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { EmployeeEntity } from './entity/EmployeeEntity';
import { DepartmentEntity } from './entity/DepartmentEntity';
import logger from './logger';

const SEED_COUNT = 100;

(async () => {
    await AppDataSource.initialize();
    const employeeCount = await AppDataSource.manager.count(EmployeeEntity);
    if (employeeCount > 0) {
        logger.info(`Found ${employeeCount.toLocaleString()} employees. Not seeding`);
        return;
    }

    logger.info(`Found ${employeeCount.toLocaleString()} employees. Seeding now.`);

    const employees: EmployeeEntity[] = [];

    for (let i = 0; i < SEED_COUNT; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        const employee = AppDataSource.manager.create(EmployeeEntity, {
            name: `${firstName} ${lastName}`,
            email,
        });

        employees.push(employee);
    }

    await AppDataSource.manager.save(employees);
    logger.info(`Saved ${employees.length} employees.`);

    const departments: DepartmentEntity[] = [];

    for (let i = 0; i < 10; i++) {
        const name = faker.commerce.department();
        const manager = faker.helpers.arrayElement(employees);

        // Pick random staff (excluding the manager)
        const staff = faker.helpers
            .shuffle(employees.filter((e) => e.id !== manager.id))
            .slice(0, 10);

        const dept = AppDataSource.manager.create(DepartmentEntity, {
            name,
            manager,
            staff,
        });

        departments.push(dept);
    }

    await AppDataSource.manager.save(departments);
    logger.info(`Saved ${departments.length} departments.`);
})();
