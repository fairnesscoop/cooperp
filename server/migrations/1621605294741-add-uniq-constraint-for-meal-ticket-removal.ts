import {MigrationInterface, QueryRunner} from "typeorm";

export class addUniqConstraintForMealTicketRemoval1621605294741 implements MigrationInterface {
    name = 'addUniqConstraintForMealTicketRemoval1621605294741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "daily_rate"."amount" IS 'Stored in base 100'`);
        await queryRunner.query(`COMMENT ON COLUMN "invoice_item"."quantity" IS 'Stored in base 100'`);
        await queryRunner.query(`COMMENT ON COLUMN "invoice_item"."amount" IS 'Stored in base 100'`);
        await queryRunner.query(`COMMENT ON COLUMN "invoice_item"."discount" IS 'Stored in base 100'`);
        await queryRunner.query(`COMMENT ON COLUMN "quote_item"."quantity" IS 'Stored in base 100'`);
        await queryRunner.query(`COMMENT ON COLUMN "quote_item"."dailyRate" IS 'Stored in base 100'`);
        await queryRunner.query(`COMMENT ON COLUMN "event"."time" IS 'Stored in minutes'`);
        await queryRunner.query(`COMMENT ON COLUMN "leave"."time" IS 'Stored in minutes'`);
        await queryRunner.query(`COMMENT ON COLUMN "cooperative"."dayDuration" IS 'Stored in minutes'`);
        await queryRunner.query(`ALTER TABLE "meal_ticket_removal" ADD CONSTRAINT "UQ_484832a1c2f5aa18b60e8ca5a93" UNIQUE ("date", "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_ticket_removal" DROP CONSTRAINT "UQ_484832a1c2f5aa18b60e8ca5a93"`);
        await queryRunner.query(`COMMENT ON COLUMN "cooperative"."dayDuration" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "leave"."time" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "event"."time" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "quote_item"."dailyRate" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "quote_item"."quantity" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "invoice_item"."discount" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "invoice_item"."amount" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "invoice_item"."quantity" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "daily_rate"."amount" IS NULL`);
    }

}
