import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { EmployeeEntity } from './EmployeeEntity';

@Entity('departments')
export class DepartmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => EmployeeEntity, { nullable: false })
    manager: EmployeeEntity;

    @ManyToMany(() => EmployeeEntity)
    @JoinTable({
        name: 'department_staff',
        joinColumn: { name: 'departmentId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'employeeId', referencedColumnName: 'id' },
    })
    staff: EmployeeEntity[];
}
