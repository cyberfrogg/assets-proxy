import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'task_status' })
  taskStatus: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  url: string;

  @Column({ type: 'timestamp', nullable: false, name: 'die_at' })
  dieAt: Date;
}
