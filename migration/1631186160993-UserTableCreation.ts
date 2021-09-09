import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTableCreation1631186160993 implements MigrationInterface {
  name: 'UserTableCreation1631186160993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE user (id CHAR(36) PRIMARY KEY, email VARCHAR(255) UNIQUE, login VARCHAR(255) UNIQUE, password VARCHAR(255), isAdmin TINYINT DEFAULT 0, isBlocked TINYINT DEFAULT 0, isMuted TINYINT DEFAULT 0, createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6), updatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6));',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user;');
  }
}
