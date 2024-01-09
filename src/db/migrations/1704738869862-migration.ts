import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704738869862 implements MigrationInterface {
    name = 'Migration1704738869862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "expiresIn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" ADD "expiresIn" integer NOT NULL`);
    }

}
