import { Model, Column, DataType, Table } from 'sequelize-typescript';

@Table
export class JokeQueue extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING })
  jobId: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.TEXT })
  value: string;

  @Column({ type: DataType.STRING })
  url: string;

  @Column({ type: DataType.STRING })
  messageId: string;

  @Column({ type: DataType.TEXT })
  err: string;
}
