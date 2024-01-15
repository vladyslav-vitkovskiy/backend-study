import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704998804443 implements MigrationInterface {
    name = 'Migration1704998804443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "UQ_d417e5d35f2434afc4bd48cb4d2" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "UQ_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "userId"`);
    }

}
