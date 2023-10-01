import { BeforeCreate, Column, DataType, Model, Table } from 'sequelize-typescript';
import argon2 from "argon2";
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

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) {
      user.password = await argon2.hash(user.password);
    }
  }
}