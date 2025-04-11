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
    logger.info(`Found ${employeeCount.toLocaleString()} employees. Not seeding.`);
    return;
  }

  logger.info(`Seeding ${SEED_COUNT} employees and 10 departments...`);

  // 1. Create and save employees
  const unsavedEmployees: EmployeeEntity[] = [];

  for (let i = 0; i < SEED_COUNT; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    const employee = AppDataSource.manager.create(EmployeeEntity, {
      name: `${firstName} ${lastName}`,
      email,
    });

    unsavedEmployees.push(employee);
  }

  const savedEmployees = await AppDataSource.manager.save(unsavedEmployees);
  logger.info(`Saved ${savedEmployees.length} employees.`);

  // 2. Shuffle and assign to departments
  faker.helpers.shuffle(savedEmployees);

  const departments: DepartmentEntity[] = [];

  for (let i = 0; i < 10; i++) {
    const staff = savedEmployees.slice(i * 10, (i + 1) * 10);
    const manager = faker.helpers.arrayElement(staff);

    const dept = AppDataSource.manager.create(DepartmentEntity, {
      name: faker.commerce.department(),
      manager,
      staff,
    });

    departments.push(dept);
  }

  await AppDataSource.manager.save(departments);
  logger.info(`Saved ${departments.length} departments.`);
})();
