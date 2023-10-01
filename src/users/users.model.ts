import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({ allowNull: false, type: DataType.TEXT })
  firstName: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  lastName: string;

  @Column({ unique: true, allowNull: false, type: DataType.TEXT })
  email: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  password: string
}