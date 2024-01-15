import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704996016345 implements MigrationInterface {
    name = 'Migration1704996016345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "sentMassages" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "receivedMassages" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "receivedMassages" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "sentMassages" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
