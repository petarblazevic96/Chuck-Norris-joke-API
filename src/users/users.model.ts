import * as argon2 from "argon2";
import { BeforeCreate, Column, DataType, Model, Table } from 'sequelize-typescript';
@Table
export class User extends Model {
  @Column({ primaryKey: true, allowNull: false, type: DataType.UUID, defaultValue: DataType.UUIDV4})
  id: string;

  @Column({ allowNull: false, type: DataType.STRING })
  firstName: string;

  @Column({ allowNull: false, type: DataType.STRING })
  lastName: string;

  @Column({ unique: true, allowNull: false, type: DataType.STRING })
  email: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  password: string;

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) {
      user.password = await argon2.hash(user.password);
    }
  }
}