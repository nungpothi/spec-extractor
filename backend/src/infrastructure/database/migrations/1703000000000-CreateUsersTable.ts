import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1703000000000 implements MigrationInterface {
  name = 'CreateUsersTable1703000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '120',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'role',
            type: 'varchar',
            length: '20',
            default: "'VISITOR'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'IDX_USERS_EMAIL',
            columnNames: ['email'],
            isUnique: true,
          },
          {
            name: 'IDX_USERS_PHONE',
            columnNames: ['phone'],
          },
          {
            name: 'IDX_USERS_ROLE',
            columnNames: ['role'],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}