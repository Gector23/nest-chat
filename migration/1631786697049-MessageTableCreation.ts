import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageTableCreation1631786697049 implements MigrationInterface {
  name: 'MessageTableCreation1631786697049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE message (id CHAR(36) PRIMARY KEY, text VARCHAR(255), authorId CHAR(36), type ENUM("user", "info"), createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6), updatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), FOREIGN KEY (authorId) REFERENCES user (id));',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE message;');
  }
}
