import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreateRequirementsTable1703000000001 implements MigrationInterface {
  name = 'CreateRequirementsTable1703000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'requirements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'is_private',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'uuid',
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
            name: 'IDX_REQUIREMENTS_CREATED_BY',
            columnNames: ['created_by'],
          },
          {
            name: 'IDX_REQUIREMENTS_IS_PRIVATE',
            columnNames: ['is_private'],
          },
          {
            name: 'IDX_REQUIREMENTS_CREATED_AT',
            columnNames: ['created_at'],
          },
        ],
        foreignKeys: [
          {
            name: 'FK_REQUIREMENTS_CREATED_BY',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('requirements');
  }
}