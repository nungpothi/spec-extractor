import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuotationsTables1704000000000 implements MigrationInterface {
  name = 'CreateQuotationsTables1704000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quotations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'company_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'client_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'include_vat',
            type: 'boolean',
            default: true,
          },
          {
            name: 'vat_rate',
            type: 'numeric',
            precision: 5,
            scale: 4,
            default: '0.07',
          },
          {
            name: 'subtotal',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: '0',
          },
          {
            name: 'vat_amount',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: '0',
          },
          {
            name: 'total',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: '0',
          },
          {
            name: 'share_id',
            type: 'uuid',
            isNullable: true,
            isUnique: true,
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
        ],
        foreignKeys: [
          {
            name: 'FK_QUOTATIONS_USER_ID',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_QUOTATIONS_USER_ID',
            columnNames: ['user_id'],
          },
          {
            name: 'IDX_QUOTATIONS_CREATED_AT',
            columnNames: ['created_at'],
          },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'quotation_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'quotation_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name_th',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'name_en',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'qty',
            type: 'int',
            default: 1,
          },
          {
            name: 'unit_price',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: '0',
          },
          {
            name: 'total',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: '0',
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
        ],
        foreignKeys: [
          {
            name: 'FK_QUOTATION_ITEMS_QUOTATION_ID',
            columnNames: ['quotation_id'],
            referencedTableName: 'quotations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_QUOTATION_ITEMS_QUOTATION_ID',
            columnNames: ['quotation_id'],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('quotation_items');
    await queryRunner.dropTable('quotations');
  }
}
