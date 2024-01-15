import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704999596931 implements MigrationInterface {
    name = 'Migration1704999596931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`ALTER TABLE "tokens" RENAME COLUMN "userId" TO "userTokenId"`);
        await queryRunner.query(`ALTER TABLE "tokens" RENAME CONSTRAINT "UQ_d417e5d35f2434afc4bd48cb4d2" TO "UQ_e40ffaf57099524dd9aa5ea1b2e"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_e40ffaf57099524dd9aa5ea1b2e" FOREIGN KEY ("userTokenId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_e40ffaf57099524dd9aa5ea1b2e"`);
        await queryRunner.query(`ALTER TABLE "tokens" RENAME CONSTRAINT "UQ_e40ffaf57099524dd9aa5ea1b2e" TO "UQ_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`ALTER TABLE "tokens" RENAME COLUMN "userTokenId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
