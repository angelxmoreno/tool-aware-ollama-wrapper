import { AppDataSource } from './data-source';
import { EmployeeEntity } from './entity/EmployeeEntity';
import { DepartmentEntity } from './entity/DepartmentEntity';

export async function get_employee_by_name(name: string): Promise<EmployeeEntity | null> {
  return AppDataSource.getRepository(EmployeeEntity).findOneBy({ name });
}

export async function get_employee_by_email(email: string): Promise<EmployeeEntity | null> {
  return AppDataSource.getRepository(EmployeeEntity).findOneBy({ email });
}

export async function get_employee_manager(employeeId: number): Promise<EmployeeEntity | null> {
  const departments = await AppDataSource.getRepository(DepartmentEntity).find({
    relations: ['manager', 'staff'],
  });

  const dept = departments.find((d) => d.staff.some((e) => e.id === employeeId));

  return dept?.manager ?? null;
}
